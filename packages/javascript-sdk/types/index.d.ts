import type { UserProvidedConfig } from '../src/types'
import { CollectRestAPI } from '../src/core/rest.api'
import { CollectModel as InternalCollectModel } from '../src/core/model'

declare module '@collect.so/javascript-sdk' {
  export namespace Collect {}

  export class Collect extends CollectRestAPI {
    static Collect: typeof Collect

    constructor(token: string, config?: UserProvidedConfig)
    public api: CollectRestAPI

   public registerModel(model: CollectModel): CollectModel {}
  }

  // Export CollectModel
  export { InternalCollectModel as CollectModel }

  export default Collect
}