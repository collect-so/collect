import type { HttpClient } from '../network/HttpClient'
import type { Validator } from '../validators/types'
import type { CollectModel } from './model'
import type { CollectState, UserProvidedConfig } from './types'

import { CollectRestAPI } from '../api/api'
import { DEFAULT_TIMEOUT } from '../common/constants'
import { parseConfig, validateInteger } from '../utils/utils'
import { yupValidator } from '../validators/yup'

export const createCollect = (httpClient: HttpClient) => {
  class Collect extends CollectRestAPI {
    private static instance: Collect
    private _state: CollectState

    public models: Map<string, CollectModel>
    public validator: Validator

    constructor(token: string, config?: UserProvidedConfig) {
      const props = parseConfig(config)
      super(token, { ...props, httpClient })

      this._state = {
        debug: false,
        timeout: validateInteger('timeout', props.timeout, DEFAULT_TIMEOUT),
        token
      }
      this.validator = props.validator ?? yupValidator
      this.models = new Map()
    }

    public static getInstance(
      token: string,
      config?: UserProvidedConfig
    ): Collect {
      if (!Collect.instance) {
        Collect.instance = new Collect(token, config)
      }
      return Collect.instance
    }

    registerModel<T extends CollectModel>(model: T): CollectModel<T['schema']> {
      const label = model.getLabel()

      // Inject the API into the model
      model.setValidator(this.validator)
      model.init(this)

      this.models.set(label, model)
      return model as unknown as CollectModel<T['schema']> &
        Omit<CollectRestAPI, 'find'>
    }

    public getModels(): Map<string, CollectModel> {
      return this.models
    }

    public getModel(label: string): CollectModel | undefined {
      return this.models.get(label)
    }
  }

  return Collect
}
