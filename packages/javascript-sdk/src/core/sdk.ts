import { HttpClient } from '../fetcher/HttpClient.js'
import { DEFAULT_TIMEOUT } from './constants.js'
import { CollectRestAPI, CollectState, UserProvidedConfig } from '../types.js'
import { validateInteger } from '../utils/utils.js'
import { createFetcher } from '../fetcher/fetcher.js'
import { createApi } from './api.js'
import { Label, LabelOrModelOrPayload, Model, RecordPayload } from '../types/types.js'
import { isLabel, isModel } from '../utils/type-guards.js'
import { Result } from './result.js'
import { Validator } from '../validators/types.js'
import { yupValidator } from '../validators/yup.js'

const ALLOWED_CONFIG_PROPERTIES = [
  'httpClient',
  'timeout',
  'host',
  'port',
  'protocol',
  'url',
  'validator'
];
const DEFAULT_HOST = 'api.collect.so';
const DEFAULT_PORT = 443;
const DEFAULT_PROTOCOL = 'https';
const DEFAULT_BASE_PATH = '/api/v1';


const buildUrl = (props: UserProvidedConfig): string => {


  let protocol = DEFAULT_PROTOCOL
  let host = DEFAULT_HOST
  let port = DEFAULT_PORT
  let basePath = DEFAULT_BASE_PATH

  if ("url" in props) {
    const url = new URL(props.url);
    protocol = url.protocol.replace(":", "");
    host = url.hostname;
    port = parseInt(url.port);
  }

  if ("host" in props && "port" in props && "protocol" in props){
    protocol = props.protocol;
    host = props.host;
    port = props.port;
  }


  // Ensure the basePath starts with a '/'
  if (basePath && !basePath.startsWith('/')) {
    basePath = '/' + basePath;
  }

  // If the port is the default for the protocol (80 for http, 443 for https), it can be omitted
  let portString = '';
  if (!((protocol === 'http' && port === 80) || (protocol === 'https' && port === 443))) {
    portString = ':' + port;
  }

  return `${protocol}://${host}${portString}${basePath}`;
}

const parseConfig = (config?: Record<string, unknown>): UserProvidedConfig => {
  // If config is null or undefined, just bail early with no props
  if (!config) {
    return {} as UserProvidedConfig;
  }

  const isObject = config === Object(config) && !Array.isArray(config);

  if (!isObject) {
    throw new Error('Config must be an object');
  }

  const values = Object.keys(config).filter(
    (value) => !ALLOWED_CONFIG_PROPERTIES.includes(value)
  );

  if (values.length > 0) {
    throw new Error(
      `Config object may only contain the following: ${ALLOWED_CONFIG_PROPERTIES.join(
        ', '
      )}`
    );
  }

  return config as UserProvidedConfig;
}


export const createCollect = (httpClient: HttpClient) => {
  class Collect extends Result {
    private _state: CollectState;
    public api: CollectRestAPI;
    public models: Map<string, Model>;
    public validator: Validator

    constructor(token: string, config?: UserProvidedConfig) {
      const props = parseConfig(config);
      const url = buildUrl(props);

      const fetcher = createFetcher({
        token,
        url,
        httpClient
      });
      const api = createApi(fetcher);

      super(api)

      this._state = {
        token,
        url,
        httpClient,
        timeout: validateInteger('timeout', props.timeout, DEFAULT_TIMEOUT),
        debug: false,
      };
      this.validator = props.validator ?? yupValidator
      this.models = new Map()
      this.api = api
    }

    registerModel(label: Label, model: Model) {
      if (!isLabel(label)) {
        throw new Error('Label must be a string')
      }
      if (!isModel(model)) {
        throw new Error('Model must be of "Model" type')
      }

      this.models.set(label, model)
    }

    async validate(
      labelOrModelOrPayload: LabelOrModelOrPayload,
      payload?: RecordPayload
    ) {
      if (!this.validator) {
        return
      }

      let shouldValidate = false
      let model: Model

      if (isLabel(labelOrModelOrPayload)) {
        shouldValidate = this.models.has(labelOrModelOrPayload)
        model = this.models.get(labelOrModelOrPayload) as Model
      } else {
        shouldValidate = Boolean(
          typeof labelOrModelOrPayload !== undefined && payload
        )
        model = labelOrModelOrPayload as Model
      }

      if (shouldValidate) {
        await this.validator(model)(payload!)
      }
    }
  }

  return Collect;
}



