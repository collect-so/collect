import type { HttpClientInterface } from '../network/HttpClient'
import type { Validator } from '../validators/types'

type ApiConnectionConfig =
  | {
      host: string
      port: number
      protocol: string
    }
  | {
      url: string
    }

export type CollectState = {
  debug: boolean
  timeout: number
  token?: string
} & Partial<ApiConnectionConfig>

type CommonUserProvidedConfig = {
  httpClient?: HttpClientInterface
  timeout?: number
  validator?: Validator
} & ApiConnectionConfig

export type UserProvidedConfig = CommonUserProvidedConfig
