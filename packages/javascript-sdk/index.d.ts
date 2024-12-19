import type {
  CollectInferType,
  CollectRecord,
  UserProvidedConfig,
  CollectRelation
} from './src/sdk'

import {
  CollectBatchDraft,
  CollectRecordDraft,
  CollectRestAPI,
  CollectApiResponse
} from './src/api'
import { HttpClient, HttpClientResponse } from './src/network/HttpClient'
import {
  CollectModel,
  CollectRecordInstance,
  CollectRecordsArrayInstance,
  CollectTransaction
} from './src/sdk'
import { CollectModels, CollectSchema } from './src/types'

declare module '@collect.so/javascript-sdk' {
  export namespace Collect {}

  export class Collect extends CollectRestAPI {
    static Collect: typeof Collect

    constructor(token?: string, config?: UserProvidedConfig)
    public api: CollectRestAPI

    public registerModel<Model extends CollectModel = CollectModel>(model: Model): Model //CollectModel<T['schema']>
    public getModel(label: string): CollectModel
    public getModels(): Map<string, CollectModel>
    public getInstance(token: string, config?: UserProvidedConfig): Collect
    public toInstance<Schema extends CollectSchema = CollectSchema>(
      record: CollectRecord<Schema>
    ): CollectRecordInstance
  }

  export {
    CollectBatchDraft,
    CollectRelation,
    CollectApiResponse,
    CollectInferType,
    CollectModel,
    CollectModels,
    CollectRecord,
    CollectRecordDraft,
    CollectRecordInstance,
    CollectRecordsArrayInstance,
    CollectRestAPI,
    CollectSchema,
    CollectTransaction,
    HttpClient,
    HttpClientResponse
  }

  export * from './src/types'

  export default Collect
}
