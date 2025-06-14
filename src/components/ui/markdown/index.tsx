import path from 'node:path'
import { Worker } from 'node:worker_threads'
import { trim } from 'es-toolkit'
import { Text } from 'ink'
import { useEffect, useState } from 'react'
import logger from '@/utils/logger'

let isWorkerReady = false

function createWorker() {
  const worker = new Worker(path.join(import.meta.dirname, './worker.js'))

  worker.on('online', () => {
    isWorkerReady = true
  })

  worker.on('error', (error) => {
    isWorkerReady = false
    logger.error(error.message, 'Markdown worker error')
  })

  worker.on('exit', (code) => {
    isWorkerReady = false
    logger.error(`Markdown worker exited with code ${code}`)
  })

  return worker
}

let worker = createWorker()

export default function Markdown({ children }: { children: string }) {
  const [content, setContent] = useState('')

  useEffect(() => {
    const id = crypto.randomUUID()
    const updateContent = ({ markedId, markedText }: { markedId: string, markedText: string }) => {
      if (markedId !== id) {
        return
      }
      setContent(trim(markedText.trim(), '\n'))
    }

    if (!isWorkerReady) {
      worker?.terminate?.()
      worker = createWorker()
    }

    worker.on('message', updateContent)
    worker.postMessage({
      id,
      text: children,
    })

    return () => {
      worker.off('message', updateContent)
    }
  }, [children])

  return <Text>{content}</Text>
}
