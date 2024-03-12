import { CollectImportRecordsObject, CollectRecordObject } from './api'
import { FetchHttpClient } from './network/FetchHttpClient'
import { createCollect } from './sdk'
import { CollectModel } from './sdk/model'
import { CollectResult } from './sdk/result'
import { CollectTransaction } from './sdk/transaction'

const Collect = createCollect(new FetchHttpClient())

module.exports = {
  Collect,
  CollectImportRecordsObject,
  CollectModel,
  CollectRecordObject,
  CollectResult,
  CollectTransaction,
  default: Collect
}

module.exports.Collect = Collect

module.exports.default = Collect
