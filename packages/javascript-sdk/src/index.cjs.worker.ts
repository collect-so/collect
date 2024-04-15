import { CollectBatchDraft, CollectRecordDraft } from './api'
import { FetchHttpClient } from './network/FetchHttpClient'
import { HttpClient, HttpClientResponse } from './network/HttpClient'
import { createCollect } from './sdk'
import { CollectRecordInstance, CollectRecordsArrayInstance } from './sdk/instance'
import { CollectModel } from './sdk/model'
import { CollectTransaction } from './sdk/transaction'

const Collect = createCollect(new FetchHttpClient())

module.exports = {
  Collect,
  CollectBatchDraft,
  CollectModel,
  CollectRecordInstance,
  CollectRecordObject: CollectRecordDraft,
  CollectRecordsArrayInstance,
  CollectTransaction,
  HttpClient,
  HttpClientResponse,
  default: Collect
}

module.exports.Collect = Collect

module.exports.default = Collect
