import { CollectBatchDraft, CollectRecordDraft } from './api'
import { HttpClient, HttpClientResponse } from './network/HttpClient'
import { NodeHttpClient } from './network/NodeHttpClient'
import { createCollect } from './sdk'
import { CollectRecordInstance, CollectRecordsArrayInstance } from './sdk/instance'
import { CollectModel } from './sdk/model'
import { CollectTransaction } from './sdk/transaction'

export const Collect = createCollect(new NodeHttpClient())

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
