import env from '@/config/env'

export function generateSystemPrompt(locale: string) {
  return `Generate a concise chat title for the provided conversation, using language "${locale}". Only return the chat title. /no_think`
}

export function generateChatPrompt(locale: string) {
  return `${env.AI_MODEL_SYSTEM_PROMPT?.trim()}

---

user's preferred language is ${locale},
you should use user's preferred language to answer.`
}
