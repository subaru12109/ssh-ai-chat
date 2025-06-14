import type { Buffer } from 'node:buffer'
import type { PublicKeyAuthContext } from 'ssh2'
import { timingSafeEqual } from 'node:crypto'
import ssh2 from 'ssh2'
import env from '@/config/env'
import { createOrUpdateUser, getUser } from '@/db/user'
import logger from '@/utils/logger'

const { utils } = ssh2

const CACHE_TIME = 1000 * 60 * 60 * 6 // 6 hours

function checkValue(input: Buffer, allowed: Buffer) {
  const autoReject = input.length !== allowed.length
  if (autoReject) {
    return false
  }
  return timingSafeEqual(input, allowed)
}

async function getGithubKeys(username: string) {
  const githubKeys = await fetch(`https://github.com/${username}.keys`, {
    headers: {
      'Authorization': env.GITHUB_TOKEN ? `Bearer ${env.GITHUB_TOKEN}` : undefined,
      'User-Agent': 'SSH AI Chat',
    },
  })

  if (!githubKeys.ok) {
    if (githubKeys.status !== 404) {
      logger.error({ username, status: githubKeys.status, text: githubKeys.statusText }, 'fetch github keys failed')
    }
    return ''
  }

  return await githubKeys.text()
}

async function getAllowedKeys(username: string) {
  const user = await getUser(username)
  let publicKeys = user?.publicKey?.trim()

  if (!user || !publicKeys || user.updatedAt < new Date(Date.now() - CACHE_TIME)) {
    publicKeys = await getGithubKeys(username)
  }

  const allowedKeys = publicKeys.split('\n').filter(Boolean).map((key) => {
    try {
      const parsed = utils.parseKey(key.trim())
      if (parsed instanceof Error) {
        return null
      }
      return parsed
    }
    catch {
      return null
    }
  }).filter(Boolean)

  return {
    allowedKeys,
    publicKeys,
  }
}

export async function verifyPublicKey(ctx: PublicKeyAuthContext): Promise<boolean> {
  const clientKey = ctx.key
  const { allowedKeys, publicKeys } = await getAllowedKeys(ctx.username)

  logger.info({ publicKeys }, `${ctx.username}'s public keys`)

  for (const allowedKey of allowedKeys) {
    try {
      if (clientKey.algo !== allowedKey.type) {
        continue
      }
      if (checkValue(clientKey.data, allowedKey.getPublicSSH())) {
        const verified = allowedKey.verify(ctx.blob, ctx.signature, ctx.hashAlgo)
        if (verified) {
          await createOrUpdateUser(ctx.username, publicKeys)
          return true
        }
        continue
      }
    }
    catch {
      continue
    }
  }

  return false
}
