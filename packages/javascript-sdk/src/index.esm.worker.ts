import { FetchHttpClient } from './network/FetchHttpClient'
import { createCollect } from './sdk'
import { CollectModel } from './sdk/model'
import { CollectResult } from './sdk/result'

export const Collect = createCollect(new FetchHttpClient())
export { CollectModel, CollectResult }
export default Collect
