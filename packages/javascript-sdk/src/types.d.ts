import { HttpClientInterface } from './fetcher/HttpClient.js'
import { createApi } from './core/api.js'
import { Label, LabelOrModelOrPayload, Model, RecordPayload } from './types/types.js'
import { Validator } from './validators/types.js'

export type CollectConstructor = {
  new (key: string, config: Record<string, unknown>): CollectObject;
};
declare const Collect: CollectConstructor;

export type CollectState = {
  token: string;
  url: string;
  timeout: number;
  httpClient: any;
  debug: boolean;
}
export type CollectRestAPI = ReturnType<typeof createApi>

export type CollectObject = {
  models: Map<string, Model>
  validator?: Validator;
  registerModel(label: Label, model: Model): void;
  validate(
    labelOrModelOrPayload: LabelOrModelOrPayload,
    payload?: RecordPayload
  ): void;
  api: CollectRestAPI;

  _state: CollectState;
  _getPropsFromConfig: (config: Record<string, unknown>) => UserProvidedConfig;
}

type CommonUserProvidedConfig = {
  timeout?: number;
  httpClient?: HttpClientInterface;
  validator?: Validator;
}
export type UserProvidedConfig =
  | CommonUserProvidedConfig & {
    protocol: string;
    host: string;
    port: number;
  }
  | CommonUserProvidedConfig & {
    url: string;
  };