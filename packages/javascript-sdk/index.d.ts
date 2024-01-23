import type { UserProvidedConfig } from './src/sdk/types'

import { CollectRestAPI as InternalCollectRestAPI } from './src/api/rest.api'
import { CollectModel as InternalCollectModel } from './src/sdk/model'
import { CollectResult as InternalCollectResult } from './src/sdk/result'

declare module '@collect.so/javascript-sdk' {
  export namespace Collect {}

  export class Collect extends InternalCollectRestAPI {
    static Collect: typeof Collect

    constructor(token: string, config?: UserProvidedConfig)
    public api: InternalCollectRestAPI

    public registerModel(model: CollectModel): CollectModel
    public getModel(label: string): CollectModel
    public getModels(): Map<string, CollectModel>
    public getInstance(token: string, config?: UserProvidedConfig): Collect
  }

  export { InternalCollectModel as CollectModel }
  export { InternalCollectRestAPI as CollectRestAPI }
  export { InternalCollectResult as CollectResult }

  export default Collect
}
