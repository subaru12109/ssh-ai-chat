import env from '@/config/env'

export function getKVfromENV(key: string) {
  const value = env[key]
  if (!value) {
    return []
  }
  return value.split(';').map((item) => {
    const [key, value] = item.split(',')
    return {
      key,
      value,
    }
  })
}
