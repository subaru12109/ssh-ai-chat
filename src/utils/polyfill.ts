import type { TransformCallback } from 'node:stream'
import process from 'node:process'
import { Transform } from 'node:stream'

process.env.SSH_SERVER_MODE = 'true'
globalThis.__dirname = import.meta.dirname

class CRLFTransform extends Transform {
  _transform(chunk: any, encoding: BufferEncoding | 'buffer', callback: TransformCallback): void {
    const data = chunk.toString(encoding === 'buffer' ? 'utf8' : encoding)
    const transformedData = data.replace(/(?<!\r)\n/g, '\r\n')
    callback(null, transformedData)
  }
}

globalThis.CRLFTransform = CRLFTransform
