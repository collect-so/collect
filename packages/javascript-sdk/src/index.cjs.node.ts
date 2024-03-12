import { CollectImportRecordsObject, CollectRecordObject } from './api'
import { NodeHttpClient } from './network/NodeHttpClient'
import { createCollect } from './sdk'
import { CollectModel } from './sdk/model'
import { CollectResult } from './sdk/result'
import { CollectTransaction } from './sdk/transaction'

const Collect = createCollect(new NodeHttpClient())

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
