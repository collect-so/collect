import { CollectBatchDraft, CollectRecordDraft } from './api'
import { HttpClient, HttpClientResponse } from './network/HttpClient'
import { NodeHttpClient } from './network/NodeHttpClient'
import { createCollect } from './sdk'
import { CollectRecordInstance, CollectRecordsArrayInstance } from './sdk/instance'
import { CollectModel } from './sdk/model'
import { CollectTransaction } from './sdk/transaction'

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
