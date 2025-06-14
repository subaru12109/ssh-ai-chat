import type { CoreMessage } from 'ai'

export type ChatMessage = CoreMessage & {
  metadata?: Record<string, string | number> & {
    modelName?: string
    version?: number
  }
}
