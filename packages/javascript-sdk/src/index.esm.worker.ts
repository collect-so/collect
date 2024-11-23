import { FetchHttpClient } from './network/FetchHttpClient.js'
import { HttpClient, HttpClientResponse } from './network/HttpClient.js'
import {
  CollectModel,
  CollectRecordInstance,
  CollectRecordsArrayInstance,
  CollectTransaction,
  createCollect,
  idToDate,
  idToTimestamp
} from './sdk/index.js'

const Collect = createCollect(new FetchHttpClient())

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
