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

module.exports = {
  Collect,
  CollectBatchDraft,
  CollectModel,
  CollectRecordDraft,
  CollectRecordInstance,
  CollectRecordsArrayInstance,
  CollectTransaction,
  HttpClient,
  HttpClientResponse,
  default: Collect
}

module.exports.Collect = Collect

module.exports.default = Collect
