import { HttpClient, HttpClientResponse } from './network/HttpClient.js'
import { NodeHttpClient } from './network/NodeHttpClient.js'
import {
  CollectModel,
  CollectRecordInstance,
  CollectRecordsArrayInstance,
  CollectTransaction,
  createCollect,
  idToDate,
  idToTimestamp
} from './sdk/index.js'

const Collect = createCollect(new NodeHttpClient())

export {
  Collect,
  CollectModel,
  CollectRecordInstance,
  CollectRecordsArrayInstance,
  CollectTransaction,
  HttpClient,
  HttpClientResponse,
  idToDate,
  idToTimestamp
}
export default Collect
