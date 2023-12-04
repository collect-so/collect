import { HttpClient, HttpClientResponse } from '../fetcher/HttpClient.js'
import { DEFAULT_TIMEOUT } from './constants.js'
import { CollectObject, UserProvidedConfig } from '../types.js'
import { validateInteger } from '../utils/utils.js'
import { createFetcher } from '../fetcher/fetcher.js'
import { createApi } from './api.js'
import { Label, LabelOrModelOrPayload, Model, RecordPayload } from '../types/types.js'
import { isLabel, isModel } from '../utils/type-guards.js'
import { yupValidator } from '../validators/yup.js'

const ALLOWED_CONFIG_PROPERTIES = [
  'maxNetworkRetries',
  'httpClient',
  'timeout',
  'host',
  'port',
  'protocol',
  'url'
];
const DEFAULT_HOST = 'api.collect.so';
const DEFAULT_PORT = '443';
const DEFAULT_BASE_PATH = '/api/v1';


export const createCollect = (httpClient: HttpClient): typeof Collect => {
  Collect.HttpClient = HttpClient;
  Collect.HttpClientResponse = HttpClientResponse;


  function Collect(
    this: CollectObject,
    apiToken: string,
    config: Record<string, unknown> = {}
  ): void {
    if (!(this instanceof Collect)) {
      return new (Collect as any)(apiToken, config);
    }

    const props = this._getPropsFromConfig(config);

    let host, port, protocol;
    if ("url" in props) {
      const url = new URL(props.url as string)
      protocol = url.protocol.replace(":", "");
      host = url.hostname;
      port = url.port;
    }
    if ("host" in props && "port" in props && "protocol" in props){
      protocol = props.protocol;
      host = props.host;
      port = props.port;
    }
    this._api = {
      token: `${apiToken}`,
      host: host ?? DEFAULT_HOST,
      port: port ?? DEFAULT_PORT,
      protocol: protocol ?? 'https',
      basePath: DEFAULT_BASE_PATH,
      timeout: validateInteger('timeout', props.timeout, DEFAULT_TIMEOUT),
      maxNetworkRetries: validateInteger(
        'maxNetworkRetries',
        props.maxNetworkRetries,
        1
      ),
      httpClient: props.httpClient || httpClient,
      dev: false,
    };


    this.validator = yupValidator
    this.models = new Map()

    this.registerModel = (label: Label, model: Model) => {
      if (!isLabel(label)) {
        throw new Error('Label must be a string')
      }
      if (!isModel(model)) {
        throw new Error('Model must be of "Model" type')
      }

      this.models.set(label, model)
    }

    this.validate = async (
      labelOrModelOrPayload: LabelOrModelOrPayload,
      payload?: RecordPayload
    ) => {
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

    // Public API
    const fetcher = createFetcher(this._api)
    Object.assign(this, createApi(fetcher))
  }


  Collect.prototype = {
    _getPropsFromConfig(config: Record<string, unknown>): UserProvidedConfig {
      // If config is null or undefined, just bail early with no props
      if (!config) {
        return {};
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

      return config;
    },
  } as CollectObject

  return Collect;
}



