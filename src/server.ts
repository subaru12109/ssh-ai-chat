import fs from 'node:fs'
import { clearScreen } from 'ansi-escapes'
import { throttle } from 'es-toolkit'
import ssh2 from 'ssh2'
import env from '@/config/env'
import kv, { kvConfig } from '@/kv'
import { version } from '../package.json'
import createInkApp from './app'
import { verifyPublicKey } from './auth'
import { keyPath } from './config'
import logger from './utils/logger'
import { loginPreCheck } from './utils/login'

const server = new ssh2.Server({
  greeting: 'Welcome to the SSH AI Chat server!',
  ident: `SSH AI Chat/${version}`,
  hostKeys: [fs.readFileSync(keyPath)],
  // debug: console.debug,
}, (client, clientInfo) => {
  logger.info({ ip: clientInfo.ip }, 'request from a new client')
  const user: Record<string, string> = {}
  const env: Record<string, string> = {}

  client.on('authentication', async (ctx) => {
    ctx.username = ctx.username.toLowerCase()
    logger.info({ ip: clientInfo.ip, username: ctx.username, method: ctx.method }, 'client authentication')
    if (ctx.method !== 'publickey') {
      return ctx.reject(['publickey'])
    }

    const { passed, message, loginFailedKey, loginFailedTimes } = await loginPreCheck(ctx, clientInfo)

    if (!passed) {
      logger.info({ ip: clientInfo.ip, username: ctx.username, loginFailedTimes }, 'loginPreCheck limit')
      // @ts-expect-error ssh tips
      ctx.reject([message])
    }

    try {
      const isVerified = await verifyPublicKey(ctx)

      if (!isVerified) {
        await kv.set(loginFailedKey, loginFailedTimes + 1, 'EX', kvConfig.loginFailed.ttl)
        return ctx.reject([
          // @ts-expect-error ssh tips
          '\r\n\r\n Please add a new SSH key to your GitHub account \r\n https://git.new/ssh-keys \r\n\r\n',
        ])
      }

      ctx.accept()
      Object.assign(user, {
        username: ctx.username,
        ip: clientInfo.ip,
      })
    }
    catch (error) {
      logger.error({ ip: clientInfo.ip, username: ctx.username, error: error instanceof Error ? error.message : error }, 'client authentication failed')
      await kv.set(loginFailedKey, loginFailedTimes + 1, 'EX', kvConfig.loginFailed.ttl)
      return ctx.reject(['publickey'])
    }
  })

  client.on('close', () => {
    logger.info({ ip: clientInfo.ip, username: user.username }, 'client disconnected')
  })

  client.on('error', (error: Error) => {
    logger.error({ ip: clientInfo.ip, username: user.username, error: error.message }, 'client error')
  })

  client.on('ready', () => {
    logger.info({ ip: clientInfo.ip, username: user.username }, 'client authenticated')

    client.on('session', (acceptSession) => {
      const session = acceptSession()
      const ptyInfo = { cols: 80, rows: 24 }

      session.on('pty', (acceptPty, rejectPty, info) => {
        logger.info({ ip: clientInfo.ip, username: user.username, info }, 'client requested PTY')
        Object.assign(ptyInfo, info)
        acceptPty?.()
      })

      session.on('env', (acceptEnv, rejectEnv, info) => {
        logger.info({ ip: clientInfo.ip, username: user.username, info }, 'client send ENV')
        env[info.key] = info.val
        acceptEnv?.()
      })

      session.on('exec', (acceptExec, rejectExec, info) => {
        logger.info({ ip: clientInfo.ip, username: user.username, info }, 'client requested exec')
        const exec = acceptExec?.()
        switch (info.command) {
          case 'whoami':
            exec?.write(`${user.username}\r\n`)
            break
          case 'env':
            exec?.write(`${Object.entries(env).map(([key, value]) => `${key}=${value}`).join('\n')}\r\n`)
            break
          default:
            exec?.write(`Unknown command: ${info.command}\r\n`)
            break
        }
        exec?.end()
      })

      session.on('shell', (acceptShell) => {
        logger.info({ ip: clientInfo.ip, username: user.username }, 'client requested a shell')
        const shell = acceptShell()
        const fakePTY = new globalThis.CRLFTransform()

        fakePTY.pipe(shell.stdout)
        fakePTY.columns = ptyInfo.cols
        fakePTY.rows = ptyInfo.rows

        // @ts-expect-error Mock TTY
        shell.stdin.isTTY = true
        // @ts-expect-error Mock TTY
        shell.stdin.setRawMode = () => {}
        // @ts-expect-error Mock TTY
        const socket = client._sock as NodeJS.Socket
        // @ts-expect-error Mock TTY
        shell.ref = () => socket.ref?.()
        // @ts-expect-error Mock TTY
        shell.unref = () => socket.unref?.()

        fakePTY.write(clearScreen)

        const ink = createInkApp({
          stdin: shell.stdin as unknown as NodeJS.ReadStream,
          stdout: fakePTY as unknown as NodeJS.WriteStream,
          stderr: shell.stderr as unknown as NodeJS.WriteStream,
          patchConsole: false,
          exitOnCtrlC: false,
          user,
          env,
        })

        shell.on('close', () => {
          logger.info({ ip: clientInfo.ip, username: user.username }, 'shell closed')
          ink.unmount()
          fakePTY.end()
          shell.stdout.end()
        })

        shell.on('error', (error: Error) => {
          logger.error({ ip: clientInfo.ip, username: user.username, error: error.message }, 'shell stream error')
          ink.unmount()
          fakePTY.end()
          shell.stdout.end()
        })

        const resize = throttle(() => {
          fakePTY.emit('resize')
        }, 500, {
          edges: ['trailing'],
        })

        session.on('window-change', (acceptWindowChange, rejectWindowChange, info) => {
          Object.assign(ptyInfo, info)

          fakePTY.columns = ptyInfo.cols
          fakePTY.rows = ptyInfo.rows

          resize()

          acceptWindowChange?.()
        })
      })
    })
  })
})

server.listen(Number(env.PORT), env.HOST, () => {
  logger.info({ host: env.HOST, port: env.PORT }, 'AI Chat Server listening')
})
