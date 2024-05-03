import { CollectBatchDraft, CollectRecordDraft } from './api'
import { FetchHttpClient } from './network/FetchHttpClient'
import { HttpClient, HttpClientResponse } from './network/HttpClient'
import { createCollect } from './sdk'
import { CollectRecordInstance, CollectRecordsArrayInstance } from './sdk/instance'
import { CollectModel } from './sdk/model'
import { CollectTransaction } from './sdk/transaction'

export const Collect = createCollect(new FetchHttpClient())

export {
  CollectBatchDraft,
  CollectModel,
  CollectRecordDraft,
  CollectRecordInstance,
  CollectRecordsArrayInstance,
  CollectTransaction,
  HttpClient,
  HttpClientResponse
}
export default Collect
