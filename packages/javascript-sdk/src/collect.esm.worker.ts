import { createCollect } from './core/sdk.js'
import { FetchHttpClient } from './fetcher/FetchHttpClient.js'

export const Collect = createCollect(new FetchHttpClient());

export default Collect