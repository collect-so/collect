import type { CollectSDKResult } from './src/sdk/types'
import type { UserProvidedConfig } from './src/sdk/types'

import { CollectImportRecordsObject, CollectRecordObject, CollectRestAPI } from './src/api'
import { CollectModel, createCollectModel } from './src/sdk/model'
import { CollectArrayResult, CollectResult } from './src/sdk/result'
import { CollectTrasaction } from './src/sdk/transaction'

declare module '@collect.so/javascript-sdk' {
  export namespace Collect {}

  export class Collect extends CollectRestAPI {
    static Collect: typeof Collect

    constructor(token: string, config?: UserProvidedConfig)
    public api: CollectRestAPI

    public registerModel<T extends CollectModel = CollectModel>(model: T): CollectModel<T['schema']>
    public getModel(label: string): CollectModel
    public getModels(): Map<string, CollectModel>
    public getInstance(token: string, config?: UserProvidedConfig): Collect
  }

  export {
    CollectArrayResult,
    CollectImportRecordsObject,
    CollectModel,
    CollectRecordObject,
    CollectRestAPI,
    CollectResult,
    CollectSDKResult,
    CollectTrasaction,
    createCollectModel
  }

  export default Collect
}
