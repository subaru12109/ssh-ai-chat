import pino from 'pino'
import pretty from 'pino-pretty'
import SonicBoom from 'sonic-boom'
import env from '@/config/env'

const level = !env.DEV ? 'info' : 'debug'

const stream = !env.DEV
  ? undefined
  : pretty({
      minimumLevel: level,
      destination: new SonicBoom({ dest: 'logs/app.log', mkdir: true, sync: true }),
    })

export default stream
  ? pino({ level }, stream)
  : pino()
