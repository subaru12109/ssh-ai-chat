import Redis from 'ioredis'
import RedisMock from 'ioredis-mock'
import env from '@/config/env'

export const namespaces = {
  rateLimit: 'rate-limit:',
  loginFailed: 'login-failed:',
}

export const kvConfig = {
  rateLimit: {
    ttl: Number(env.RATE_LIMIT_TTL ?? 3600),
    limit: Number(env.RATE_LIMIT_LIMIT ?? 1800),
  },
  loginFailed: {
    ttl: Number(env.LOGIN_FAILED_TTL ?? 600),
    limit: Number(env.LOGIN_FAILED_LIMIT ?? 60),
  },
}

const redis = env.REDIS_URL ? new Redis(env.REDIS_URL) : new RedisMock()

export default redis
