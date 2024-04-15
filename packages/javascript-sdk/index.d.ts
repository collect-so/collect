import type { CollectRecord } from '@collect.so/types'

import type { UserProvidedConfig } from './src/sdk/types'
import type { CollectSchema } from './src/types'

import { CollectBatchDraft, CollectRecordDraft, CollectRestAPI } from './src/api'
import { HttpClient, HttpClientResponse } from './src/network/HttpClient'
import { CollectRecordInstance, CollectRecordsArrayInstance } from './src/sdk/instance'
import { CollectModel, createCollectModel } from './src/sdk/model'
import { CollectTrasaction } from './src/sdk/transaction'
import { CollectInferType, CollectSDKResult } from './src/types'

declare module '@collect.so/javascript-sdk' {
  export namespace Collect {}

  export class Collect extends CollectRestAPI {
    static Collect: typeof Collect

    constructor(token?: string, config?: UserProvidedConfig)
    public api: CollectRestAPI

    public registerModel<T extends CollectModel = CollectModel>(model: T): CollectModel<T['schema']>
    public getModel(label: string): CollectModel
    public getModels(): Map<string, CollectModel>
    public getInstance(token: string, config?: UserProvidedConfig): Collect
    public toInstance<T extends CollectSchema = CollectSchema>(
      record: CollectRecord<T>
    ): CollectRecordInstance
  }

  export {
    CollectBatchDraft,
    CollectInferType,
    CollectModel,
    CollectRecordDraft,
    CollectRecordInstance,
    CollectRecordsArrayInstance,
    CollectRestAPI,
    CollectSDKResult,
    CollectTrasaction,
    HttpClient,
    HttpClientResponse,
    createCollectModel
  }

  export * from './src/types'

  export default Collect
}
