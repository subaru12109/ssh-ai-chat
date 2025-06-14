import { createOpenAI } from '@ai-sdk/openai'
import { AI_MODEL_CONFIG, AI_MODEL_LIST } from './config'

export const models = AI_MODEL_LIST.reduce((acc, model) => {
  const config = AI_MODEL_CONFIG[model]
  acc[model] = createOpenAI({
    baseURL: config.api,
    apiKey: config.key,
    name: model,
  })
  return acc
}, {})
