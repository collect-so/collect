import { NodeHttpClient } from './network/NodeHttpClient'
import { createCollect } from './sdk'
import { CollectModel } from './sdk/model'
import { CollectResult } from './sdk/result'

const Collect = createCollect(new NodeHttpClient())

module.exports = {
  Collect,
  CollectModel,
  CollectResult,
  default: Collect
}

module.exports.Collect = Collect

module.exports.default = Collect
