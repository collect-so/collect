import type { HttpClient } from '../network/HttpClient.js'
import type { CollectModels, CollectSchema } from '../types/index.js'
import type { CollectModel } from './model.js'
import type { CollectRecord } from './record.js'
import type { CollectState, UserProvidedConfig } from './types.js'

import { CollectRestAPI } from '../api/api.js'
import { DEFAULT_TIMEOUT } from '../common/constants.js'
import { parseConfig, validateInteger } from '../common/utils.js'
import { CollectRecordInstance } from './record.js'

export const createCollect = (httpClient: HttpClient) => {
  class Collect extends CollectRestAPI implements Collect {
    static instance: Collect
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

      Collect.instance = this
    }

    public static getInstance(): Collect {
      return Collect.instance
    }

    registerModel<Model extends CollectModel = CollectModel>(model: Model) {
      const label = model.getLabel()

      // Inject the API into the model
      model.init(this)

      this.models.set(label, model)
      return model //as unknown as CollectModel<T['schema']> & Omit<CollectRestAPI, 'find'>
    }

    public getModels(): Map<string, CollectModel> {
      return this.models
    }

    public getModel<Label extends keyof CollectModels | string = keyof CollectModels>(
      label: Label
    ): Label extends keyof CollectModels ? CollectModel<CollectModels[Label]>
    : CollectModel | undefined {
      return this.models.get(label) as Label extends keyof CollectModels ? CollectModels[Label]
      : CollectModel
    }

    public toInstance<Schema extends CollectSchema = CollectSchema>(record: CollectRecord<Schema>) {
      const result = new CollectRecordInstance<Schema>(record)
      result.init(this)
      return result
    }
  }

  return Collect
}
