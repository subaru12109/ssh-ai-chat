import type ssh2 from 'ssh2'
import env from '@/config/env'
import kv, { kvConfig, namespaces } from '@/kv'

const blacklist = env.BLACK_LIST?.split(',') ?? []
const whitelist = env.WHITE_LIST?.split(',') ?? []

export async function loginPreCheck(ctx: ssh2.AuthContext, clientInfo: ssh2.ClientInfo) {
  const loginFailedKey = `${namespaces.loginFailed}:${clientInfo.ip}`
  const result = {
    passed: true,
    message: '',
    loginFailedKey,
    loginFailedTimes: +(await kv.get(loginFailedKey)) || 0,
  }

  if (blacklist.includes(ctx.username)) {
    result.passed = false
    result.message = `\r\n\r\n You are in the blacklist, please contact the administrator. \r\n\r\n`
    return result
  }

  if (env.PUBLIC_SERVER !== 'true' && !whitelist.includes(ctx.username)) {
    result.passed = false
    result.message = `\r\n\r\n You are not allowed to login to this server. \r\n\r\n`
    return result
  }

  if (result.loginFailedTimes >= kvConfig.loginFailed.limit) {
    result.passed = false
    result.message = `\r\n\r\n You have failed to login ${result.loginFailedTimes} times, please try again later. \r\n\r\n`
    return result
  }

  return result
}
