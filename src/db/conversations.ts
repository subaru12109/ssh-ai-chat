import type { ChatMessage } from '@/types/chat'
import db from './index'
import { conversations } from './schema'

export async function getConversationList(username: string) {
  return db.query.conversations.findMany({
    where: (conversation, { eq }) => eq(conversation.username, username),
    orderBy: (conversation, { desc }) => desc(conversation.updatedAt),
    limit: 100,
    columns: {
      title: true,
      conversationId: true,
    },
  })
}

export async function getConversation(username: string, conversationId: string) {
  return db.query.conversations.findFirst({
    where: (conversation, { eq, and }) => and(eq(conversation.username, username), eq(conversation.conversationId, conversationId)),
    columns: {
      messages: true,
    },
  })
}

export async function createOrUpdateConversation(username: string, conversationId: string, title: string, messages: ChatMessage[]) {
  return db.insert(conversations).values({
    username,
    conversationId,
    title,
    messages,
  }).onConflictDoUpdate({
    target: conversations.conversationId,
    set: {
      title,
      messages,
    },
  })
}
