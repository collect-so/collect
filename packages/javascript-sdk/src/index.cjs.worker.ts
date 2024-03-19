import { CollectImportRecordsObject, CollectRecordObject } from './api'
import { FetchHttpClient } from './network/FetchHttpClient'
import { HttpClient, HttpClientResponse } from './network/HttpClient'
import { createCollect } from './sdk'
import { CollectModel } from './sdk/model'
import { CollectRecordResult } from './sdk/result'
import { CollectTransaction } from './sdk/transaction'

const Collect = createCollect(new FetchHttpClient())

module.exports = {
  Collect,
  CollectImportRecordsObject,
  CollectModel,
  CollectRecordObject,
  CollectRecordResult,
  CollectTransaction,
  HttpClient,
  HttpClientResponse,
  default: Collect
}

module.exports.Collect = Collect

module.exports.default = Collect
