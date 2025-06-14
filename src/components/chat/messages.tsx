import type { BoxProps } from 'ink'
import type { ChatMessage } from '@/types/chat'
import { Box } from 'ink'
import TextInput from 'ink-text-input'
import { useCallback, useState } from 'react'
import { useGlobal } from '@/context/global'
import { m } from '@/i18n/messages.js'
import Markdown from '../ui/markdown'
import Scroller from '../ui/scroller'
import { Avatar } from './avatar'

interface MessageItemProps extends BoxProps {
  message: ChatMessage
}

interface MessageListProps extends BoxProps {
  messages: ChatMessage[]
}

interface MessageInputProps extends BoxProps {
  onSubmit?: (value: string) => void
}

function MessageItem({ message, ...props }: MessageItemProps) {
  const { user } = useGlobal()
  return (
    <Box
      flexDirection="column"
      marginTop={-1}
      {...props}
    >
      <Box>
        <Avatar
          text={message.role === 'assistant' ? message.metadata?.modelName : user.username}
        />
      </Box>
      <Box padding={1}>
        <Markdown>{message.content as string}</Markdown>
      </Box>
    </Box>
  )
}

export function MessageList({ messages, ...props }: MessageListProps) {
  const lastMessage = messages.at(-1)
  const version = lastMessage?.metadata?.version ?? 0
  const { isInputFocused } = useGlobal()
  // logger.debug({ lastMessage }, 'lastMessage')
  return (
    <Scroller
      flexGrow={1}
      version={version}
      shortcuts={isInputFocused}
      {...props}
    >
      {messages.map(message => (
        <MessageItem
          borderStyle="classic"
          borderColor="blue"
          borderLeft={false}
          borderRight={false}
          borderTop={false}
          borderBottom={message.metadata?.id !== lastMessage?.metadata?.id}
          key={message.metadata?.id}
          message={message}
        />
      ))}
    </Scroller>
  )
}

export function MessageInput({ onSubmit, ...props }: MessageInputProps) {
  const [query, setQuery] = useState('')
  const { locale } = useGlobal()
  const { isInputFocused } = useGlobal()

  const handleSubmit = useCallback(() => {
    if (query.trim()) {
      onSubmit?.(query)
      setQuery('')
    }
  }, [query, onSubmit])

  return (
    <Box
      flexShrink={0}
      flexDirection="column"
      borderStyle="single"
      borderColor="blue"
      borderLeft={false}
      borderRight={false}
      borderBottom={false}
      {...props}
    >
      <TextInput
        focus={isInputFocused}
        value={query}
        placeholder={m['message.input'](null, { locale })}
        onChange={setQuery}
        onSubmit={handleSubmit}
      />
    </Box>
  )
}
