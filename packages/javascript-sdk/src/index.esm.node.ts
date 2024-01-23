import { NodeHttpClient } from './network/NodeHttpClient'
import { createCollect } from './sdk'
import { CollectModel } from './sdk/model'
import { CollectResult } from './sdk/result'

export const Collect = createCollect(new NodeHttpClient())
export { CollectModel, CollectResult }
export default Collect
