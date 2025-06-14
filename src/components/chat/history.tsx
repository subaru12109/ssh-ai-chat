import type { BoxProps } from 'ink'
import type { ChatMessage } from '@/types/chat'
import { Box, measureElement, Text, useFocus } from 'ink'
import SelectInput from 'ink-select-input'
import { useRef } from 'react'
import { useChatContext } from '@/context/chat'
import { useGlobal } from '@/context/global'
import { getConversation } from '@/db/conversations'
import { m } from '@/i18n/messages'

function HistoryItem({ label }: { label: string }) {
  return (
    <Box>
      <Text wrap="truncate">{label}</Text>
    </Box>
  )
}

export default function History({ ...props }: BoxProps) {
  const { isFocused } = useFocus({
    id: 'history',
  })
  const { user, locale } = useGlobal()
  const { conversations, setMessages, conversationId, setConversationId } = useChatContext()

  const selectConversation = async (conversation: { value: string }) => {
    if (!conversation?.value || conversation.value === conversationId) {
      return
    }

    const conversationData = await getConversation(user.username, conversation.value)

    if (Array.isArray(conversationData?.messages)) {
      setMessages(conversationData.messages as ChatMessage[])
      setConversationId(conversation.value)
    }
    else {
      setMessages([])
      setConversationId(conversation.value)
    }
  }

  const historyRef = useRef(null)
  const { height } = historyRef.current ? measureElement(historyRef.current) : {}

  return (
    <Box ref={historyRef} {...props} paddingX={1} flexDirection="column" overflow="hidden">
      <Box borderStyle="classic" borderColor="blue" borderTop={false} borderRight={false} borderLeft={false}>
        <Text bold wrap="truncate" color={isFocused ? 'greenBright' : 'blueBright'}>{m['history.title'](null, { locale })}</Text>
      </Box>
      <SelectInput
        items={conversations}
        isFocused={isFocused}
        limit={height - 2}
        itemComponent={HistoryItem}
        onHighlight={selectConversation}
      />
    </Box>
  )
}
