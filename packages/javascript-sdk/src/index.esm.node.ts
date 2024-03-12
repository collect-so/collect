import { CollectImportRecordsObject, CollectRecordObject } from './api'
import { NodeHttpClient } from './network/NodeHttpClient'
import { createCollect } from './sdk'
import { CollectModel } from './sdk/model'
import { CollectResult } from './sdk/result'
import { CollectTransaction } from './sdk/transaction'

export const Collect = createCollect(new NodeHttpClient())

export {
  CollectImportRecordsObject,
  CollectModel,
  CollectRecordObject,
  CollectResult,
  CollectTransaction
}
export default Collect
