import type { ReactNode } from 'react'
import { createContext, use } from 'react'
import { useChat } from '@/hooks/chat'

const ChatContext = createContext<ReturnType<typeof useChat> | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const chatHook = useChat()
  return (
    <ChatContext value={chatHook}>
      {children}
    </ChatContext>
  )
}

export function useChatContext() {
  const context = use(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider')
  }
  return context
}
