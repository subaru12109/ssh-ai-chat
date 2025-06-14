import env from '@/config/env'
import logger from '@/utils/logger'

const models = [
  ...env.AI_MODELS.split(',').filter(m => Boolean(m.trim())),
  env.AI_SYSTEM_MODEL,
].filter(Boolean)

type MODELS = Record<string, string>
type MODEL_CONFIG = Record<string, {
  type?: string
  name?: string
  id?: string
  api?: string
  key?: string
}>

export const AI_MODELS: MODELS = models.reduce((acc, model) => {
  model = model.trim()
  const configName = model.replace(/-/g, '_').replaceAll('.', '_').toUpperCase()
  if (env[`AI_MODEL_CONFIG_${configName}`]) {
    acc[model] = configName
  }
  else {
    logger.warn(`model(${model}) config is not found in env, expected: ${configName}`)
  }
  return acc
}, {} as MODELS)

export const AI_MODEL_LIST = Object.keys(AI_MODELS)

export const AI_MODEL_CONFIG = AI_MODEL_LIST.reduce((acc, model) => {
  const config = env[`AI_MODEL_CONFIG_${AI_MODELS[model]}`] || ''
  const [type, id, api, key] = config.split(',')
  acc[model] = {
    type,
    name: model,
    id,
    api,
    key,
  }
  return acc
}, {} as MODEL_CONFIG)

// logger.info(AI_MODELS, 'Available AI models')
// logger.debug(AI_MODEL_CONFIG, 'AI model config')
