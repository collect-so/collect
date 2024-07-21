import type { HttpClientInterface } from '../network/HttpClient'

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
} & ApiConnectionConfig

export type UserProvidedConfig = CommonUserProvidedConfig
