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

module.exports = {
  Collect,
  CollectModel,
  CollectRecordInstance,
  CollectRecordsArrayInstance,
  CollectTransaction,
  HttpClient,
  HttpClientResponse,
  default: Collect,
  idToDate,
  idToTimestamp
}

module.exports.Collect = Collect

module.exports.default = Collect
