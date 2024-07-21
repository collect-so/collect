import type { HttpClient } from '../network/HttpClient'
import type { CollectModels, CollectRecord, CollectSchema } from '../types'
import type { CollectModel } from './model'
import type { CollectState, UserProvidedConfig } from './types'

import { CollectRestAPI } from '../api'
import { DEFAULT_TIMEOUT } from '../common/constants'
import { parseConfig, validateInteger } from '../common/utils'
import { CollectRecordInstance } from './instance'

export const createCollect = (httpClient: HttpClient) => {
  class Collect extends CollectRestAPI {
    state: CollectState

    public models: Map<string, CollectModel>

    constructor(token?: string, config?: UserProvidedConfig) {
      const props = parseConfig(config)
      super(token, { ...props, httpClient: props.httpClient ?? httpClient })

      this.state = {
        debug: false,
        timeout: validateInteger('timeout', props.timeout, DEFAULT_TIMEOUT),
        token
      }
      this.models = new Map()
    }

    registerModel<T extends CollectModel = CollectModel>(model: T): CollectModel<T['schema']> {
      const label = model.getLabel()

      // Inject the API into the model
      model.init(this)

      this.models.set(label, model)
      return model as unknown as CollectModel<T['schema']> & Omit<CollectRestAPI, 'find'>
    }

    public getModels(): Map<string, CollectModel> {
      return this.models
    }

    public getModel<T extends keyof CollectModels | string = keyof CollectModels>(
      label: T
    ): T extends keyof CollectModels ? CollectModel<CollectModels[typeof label]>
    : CollectModel | undefined {
      return this.models.get(label) as T extends keyof CollectModels ? CollectModels[typeof label]
      : CollectModel
    }

    public toInstance<T extends CollectSchema = CollectSchema>(record: CollectRecord<T>) {
      const result = new CollectRecordInstance<T>(record)
      result.init(this)
      return result
    }
  }

  return Collect
}
