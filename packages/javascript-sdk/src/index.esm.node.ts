import { HttpClient, HttpClientResponse } from './network/HttpClient.js'
import { NodeHttpClient } from './network/NodeHttpClient.js'
import {
  CollectBatchDraft,
  CollectModel,
  CollectRecordInstance,
  CollectRecordsArrayInstance,
  CollectTransaction,
  EmptyTargetError,
  NotFoundError,
  UniquenessError,
  ValidationError,
  createCollect,
  idToDate,
  idToTimestamp
} from './sdk/index.js'

const Collect = createCollect(new NodeHttpClient())

export {
  Collect,
  CollectBatchDraft,
  CollectModel,
  CollectRecordInstance,
  CollectRecordsArrayInstance,
  CollectTransaction,
  EmptyTargetError,
  HttpClient,
  HttpClientResponse,
  NotFoundError,
  UniquenessError,
  ValidationError,
  idToDate,
  idToTimestamp
}
export default Collect
