import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import ssh2 from 'ssh2'
import { keyPath } from '@/config'
import logger from '@/utils/logger'

const { utils: { generateKeyPairSync } } = ssh2

if (!existsSync(keyPath)) {
  const keys = generateKeyPairSync('ed25519')

  mkdirSync(dirname(keyPath), { recursive: true })
  writeFileSync(keyPath, keys.private)
  writeFileSync(`${keyPath}.pub`, keys.public)

  logger.info('SSH public key:', keys.public)
  logger.info('SSH private key generated', keyPath)
}
else {
  logger.info('SSH private key already exists', keyPath)
}
