import type { BoxProps } from 'ink'
import { Box } from 'ink'
import { useChatContext } from '@/context/chat'
import { Header } from './header'
import { MessageInput, MessageList } from './messages'
import { Welcome } from './welcome'

export function Chat({ ...props }: BoxProps) {
  const { messages, appendMessage } = useChatContext()

  return (
    <Box
      {...props}
      flexDirection="column"
      borderColor="blue"
      borderStyle="single"
      borderTop={false}
      borderBottom={false}
      overflow="hidden"
    >
      <Header />
      {messages.length ? <MessageList messages={messages} /> : <Welcome />}
      <MessageInput onSubmit={appendMessage} />
    </Box>
  )
}
