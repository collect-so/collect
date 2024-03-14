import { CollectImportRecordsObject, CollectRecordObject } from './api'
import { FetchHttpClient } from './network/FetchHttpClient'
import { createCollect } from './sdk'
import { CollectModel } from './sdk/model'
import { CollectRecordResult } from './sdk/result'
import { CollectTransaction } from './sdk/transaction'

export const Collect = createCollect(new FetchHttpClient())
export {
  CollectImportRecordsObject,
  CollectModel,
  CollectRecordObject,
  CollectRecordResult,
  CollectTransaction
}
export default Collect
