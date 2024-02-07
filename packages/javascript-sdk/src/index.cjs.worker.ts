import { FetchHttpClient } from './network/FetchHttpClient'
import { createCollect } from './sdk'
import { CollectModel } from './sdk/model'
import { CollectResult } from './sdk/result'

const Collect = createCollect(new FetchHttpClient())

module.exports = {
  Collect,
  CollectModel,
  CollectResult,
  default: Collect
}

module.exports.Collect = Collect

module.exports.default = Collect
