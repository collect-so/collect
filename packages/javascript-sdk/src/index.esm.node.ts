import { CollectImportRecordsObject, CollectRecordObject } from './api'
import { HttpClient, HttpClientResponse } from './network/HttpClient'
import { NodeHttpClient } from './network/NodeHttpClient'
import { createCollect } from './sdk'
import { CollectModel } from './sdk/model'
import { CollectRecordResult, CollectRecordsArrayResult } from './sdk/result'
import { CollectTransaction } from './sdk/transaction'

export const Collect = createCollect(new NodeHttpClient())

export {
  CollectImportRecordsObject,
  CollectModel,
  CollectRecordObject,
  CollectRecordResult,
  CollectRecordsArrayResult,
  CollectTransaction,
  HttpClient,
  HttpClientResponse
}
export default Collect
