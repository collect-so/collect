import { CollectImportRecordsObject, CollectRecordObject } from './api'
import { FetchHttpClient } from './network/FetchHttpClient'
import { createCollect } from './sdk'
import { CollectModel } from './sdk/model'
import { CollectResult } from './sdk/result'
import { CollectTransaction } from './sdk/transaction'

export const Collect = createCollect(new FetchHttpClient())
export {
  CollectImportRecordsObject,
  CollectModel,
  CollectRecordObject,
  CollectResult,
  CollectTransaction
}
export default Collect
