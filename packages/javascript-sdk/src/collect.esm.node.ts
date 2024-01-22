import { CollectModel } from './core/model.js'
import { createCollect } from './core/sdk.js'
import { NodeHttpClient } from './fetcher/NodeHttpClient.js'

export const Collect = createCollect(new NodeHttpClient())
export { CollectModel }
export default Collect
