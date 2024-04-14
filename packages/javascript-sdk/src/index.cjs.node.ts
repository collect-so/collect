import { CollectImportRecordsObject, CollectRecordObject } from './api'
import { HttpClient, HttpClientResponse } from './network/HttpClient'
import { NodeHttpClient } from './network/NodeHttpClient'
import { createCollect } from './sdk'
import { CollectModel } from './sdk/model'
import { CollectRecordResult, CollectRecordsArrayResult } from './sdk/result'
import { CollectTransaction } from './sdk/transaction'

const Collect = createCollect(new NodeHttpClient())

module.exports = {
  Collect,
  CollectImportRecordsObject,
  CollectModel,
  CollectRecordObject,
  CollectRecordResult,
  CollectRecordsArrayResult,
  CollectTransaction,
  HttpClient,
  HttpClientResponse,
  default: Collect
}

module.exports.Collect = Collect

module.exports.default = Collect
