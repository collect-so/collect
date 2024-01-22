import { createCollect } from './core/sdk.js'
import { FetchHttpClient } from './fetcher/FetchHttpClient.js'
import { CollectModel } from './core/model' // Import CollectModel

export const Collect = createCollect(new FetchHttpClient())
export { CollectModel }
export default Collect
