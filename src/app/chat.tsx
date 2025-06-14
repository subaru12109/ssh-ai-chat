import { Box } from 'ink'
import { Chat } from '@/components/chat'
import History from '@/components/chat/history'
import Models from '@/components/chat/models'
import { ChatProvider } from '@/context/chat'

export default function ChatPage() {
  return (
    <ChatProvider>
      <Box flexDirection="row" flexGrow={1}>
        <Models width={24} flexShrink={0} />
        <Chat flexGrow={1} />
        <History width={24} flexShrink={0} />
      </Box>
    </ChatProvider>
  )
}
