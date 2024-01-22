import type { createApi } from './core/api.js'
import type { HttpClientInterface } from './fetcher/HttpClient.js'
import type {
  Label,
  LabelOrModelOrPayload,
  Model,
  RecordPayload
} from './types/types.js'
import type { Validator } from './validators/types.js'

export type CollectConstructor = {
  new (key: string, config: Record<string, unknown>): CollectObject
}
declare const Collect: CollectConstructor

export type CollectState = {
  debug: boolean
  timeout: number
  token: string
}
export type CollectRestAPI = ReturnType<typeof createApi>

export type CollectObject = {
  _getPropsFromConfig: (config: Record<string, unknown>) => UserProvidedConfig
  _state: CollectState
  api: CollectRestAPI
  d
  models: Map<string, Model>
  registerModel(label: Label, model: Model): voi

  validate(
    labelOrModelOrPayload: LabelOrModelOrPayload,
    payload?: RecordPayload
  ): void
  validator?: Validator
}

type CommonUserProvidedConfig = {
  httpClient?: HttpClientInterface
  timeout?: number
  validator?: Validator
}
export type UserProvidedConfig =
  | (CommonUserProvidedConfig & {
      host: string
      port: number
      protocol: string
    })
  | (CommonUserProvidedConfig & {
      url: string
    })
