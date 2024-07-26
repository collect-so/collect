import { CollectBatchDraft, CollectRecordDraft } from './api/index.js'
import { HttpClient, HttpClientResponse } from './network/HttpClient.js'
import { NodeHttpClient } from './network/NodeHttpClient.js'
import {
  CollectModel,
  CollectRecordInstance,
  CollectRecordsArrayInstance,
  CollectTransaction,
  createCollect
} from './sdk/index.js'

const Collect = createCollect(new NodeHttpClient())

export {
  Collect,
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
