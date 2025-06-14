import type { User } from '@/context/global'
import kv, { kvConfig, namespaces } from '@/kv'

export async function chatPreCheck(user: User) {
  const rateLimitKey = `${namespaces.rateLimit}:${user.username}`
  const rateLimitTimes = +(await kv.get(rateLimitKey)) || 0

  if (rateLimitTimes >= kvConfig.rateLimit.limit) {
    return { passed: false, tips: 'You have reached the rate limit, please try again later.' }
  }

  return { passed: true, rateLimitKey, rateLimitTimes }
}
