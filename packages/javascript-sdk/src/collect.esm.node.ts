import { createCollect } from './core/sdk.js'
import { NodeHttpClient } from './fetcher/NodeHttpClient.js'

export const Collect = createCollect(new NodeHttpClient());

export default Collect