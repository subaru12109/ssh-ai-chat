import { parentPort } from 'node:worker_threads'
import { marked } from 'marked'
import { markedTerminal } from 'marked-terminal'
import pTimeout from 'p-timeout'

marked.use(markedTerminal({
  tab: 2,
  tableOptions: {
    wordWrap: true,
    colWidths: Array.from({ length: 5 }).fill(20),
  },
}))

parentPort.on('message', async ({ id, text }) => {
  try {
    const markedText = await pTimeout(marked.parse(text, {
      async: true,
    }), {
      milliseconds: 500,
    })
    parentPort.postMessage({
      markedId: id,
      markedText,
    })
  }
  catch {
    console.error({ id, text }, 'marked error')
  }
})
