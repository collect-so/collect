import { HttpClientInterface } from './fetcher/HttpClient.js'
import { createApi } from './core/api.js'
import { Label, LabelOrModelOrPayload, Model, RecordPayload } from './types/types.js'
import { Validator } from './validators/types.js'

export type CollectConstructor = {
  new (key: string, config: Record<string, unknown>): CollectObject;
};
declare const Collect: CollectConstructor;

export type CollectObjectApi = {
  token: string | null;
  host: string;
  port: string | number;
  protocol: string;
  basePath: string;
  timeout: number;
  maxNetworkRetries: number;
  httpClient: any;
  dev: boolean;
}
export type CollectObject = {
  models: Map<string, Model>
  validator?: Validator;
  registerModel(label: Label, model: Model): void;
  validate(
    labelOrModelOrPayload: LabelOrModelOrPayload,
    payload?: RecordPayload
  ): void;
  _api: CollectObjectApi;
  _getPropsFromConfig: (config: Record<string, unknown>) => UserProvidedConfig;

} & ReturnType<typeof createApi>;

type CommonUserProvidedConfig = {
  timeout?: number;
  maxNetworkRetries?: number;
  httpClient?: HttpClientInterface;
}
export type UserProvidedConfig =
  | CommonUserProvidedConfig & {
    protocol?: string;
    host?: string;
    port?: number;
  }
  | CommonUserProvidedConfig & {
    url?: string;
  };