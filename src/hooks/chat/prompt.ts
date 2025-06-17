import env from '@/config/env'

export function generateSystemPrompt(locale: string) {
  return `Generate a concise chat title for the provided conversation, using language "${locale}". Only return the chat title. /no_think`
}

export function generateChatPrompt(locale: string, model: string) {
  return `${env.AI_MODEL_SYSTEM_PROMPT?.trim()}

---

- You are currently using the ${model} Large Language Model.
- user's preferred language is ${locale},
you should use user's preferred language to answer.`
}
