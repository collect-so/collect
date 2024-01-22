import type { HttpClient } from '../fetcher/HttpClient.js'
import type {
  CollectState,
  UserProvidedConfig
} from '../types.js'
import type {
  Label,
} from '../types/types.js'
import type { Validator } from '../validators/types.js'

import { isLabel, isModel } from '../utils/type-guards.js'
import { validateInteger } from '../utils/utils.js'
import { yupValidator } from '../validators/yup.js'
import { DEFAULT_TIMEOUT } from './constants.js'
import {  parseConfig } from './utils.js'
import { CollectRestAPI } from './rest.api.js'
import { CollectModel } from './model.js'

export const createCollect = (httpClient: HttpClient) => {
  class Collect extends CollectRestAPI {
    private static instance: Collect;
    private _state: CollectState

    public models: Map<string, CollectModel>
    public validator: Validator

    constructor(token: string, config?: UserProvidedConfig) {
      const props = parseConfig(config)
      super(token, {...props, httpClient})

      this._state = {
        debug: false,
        timeout: validateInteger('timeout', props.timeout, DEFAULT_TIMEOUT),
        token,
      }
      this.validator = props.validator ?? yupValidator
      this.models = new Map()
    }

    public static getInstance(token: string, config?: UserProvidedConfig): Collect {
      if (!Collect.instance) {
        Collect.instance = new Collect(token, config);
      }
      return Collect.instance;
    }

    registerModel(model: CollectModel): CollectModel {
      const label = model.getLabel()

      if (!isLabel(label)) {
        throw new Error('Label must be a string');
      }
      // if (!isModel(model)) {
      //   throw new Error('Model must be of "Model" type');
      // }

      // Inject the API into the model
      model._setApi(this.api); // Assuming `this.api` is accessible and appropriate
      this.models.set(label, model);
      return model;
    }

    public getModel(label: string): CollectModel | undefined {
      return this.models.get(label);
    }
  }

  return Collect
}
