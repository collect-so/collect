import type { CollectSDKResult } from './src/sdk/types'
import type { UserProvidedConfig } from './src/sdk/types'

import { CollectRestAPI } from './src/api/api'
import { CollectModel } from './src/sdk/model'
import { createCollectModel } from './src/sdk/model'
import { CollectArrayResult, CollectResult } from './src/sdk/result'

declare module '@collect.so/javascript-sdk' {
  export namespace Collect {}

  export class Collect extends CollectRestAPI {
    static Collect: typeof Collect

    constructor(token: string, config?: UserProvidedConfig)
    public api: CollectRestAPI

    public registerModel<T extends CollectModel = CollectModel>(
      model: T
    ): CollectModel<T['schema']>
    public getModel(label: string): CollectModel
    public getModels(): Map<string, CollectModel>
    public getInstance(token: string, config?: UserProvidedConfig): Collect
  }

  export {
    CollectArrayResult,
    CollectModel,
    CollectRestAPI,
    CollectResult,
    CollectSDKResult,
    createCollectModel
  }

  export default Collect
}
