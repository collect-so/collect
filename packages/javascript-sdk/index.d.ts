import type { CollectSchema } from './src/common/types'
import type { UserProvidedConfig } from './src/sdk/types'
import type { CollectRecord } from './src/types'

import { CollectBatchDraft, CollectRecordDraft, CollectRestAPI } from './src/api'
import { CollectSDKResult } from './src/common/types'
import { HttpClient, HttpClientResponse } from './src/network/HttpClient'
import { CollectRecordInstance, CollectRecordsArrayInstance } from './src/sdk/instance'
import { CollectModel, createCollectModel } from './src/sdk/model'
import { CollectTransaction } from './src/sdk/transaction'
import { CollectInferType, CollectModels } from './src/types'

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
    CollectModels,
    CollectRecordDraft,
    CollectRecordInstance,
    CollectRecordsArrayInstance,
    CollectRestAPI,
    CollectSDKResult,
    CollectSchema,
    CollectTransaction,
    HttpClient,
    HttpClientResponse,
    createCollectModel
  }

  export * from './src/types'

  export default Collect
}
