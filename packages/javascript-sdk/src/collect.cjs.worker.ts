import { CollectModel } from './core/model.js'
import { createCollect } from './core/sdk.js'
import { FetchHttpClient } from './fetcher/FetchHttpClient.js'

const Collect = createCollect(new FetchHttpClient())

module.exports = {
    Collect,        // Export Collect
    CollectModel,   // Export CollectModel
    default: Collect // Allow use with the TypeScript compiler without `esModuleInterop`
  }

// expose constructor as a named property to enable mocking with Sinon.JS
module.exports.Collect = Collect

// Allow use with the TypeScript compiler without `esModuleInterop`.
// We may also want to add `Object.defineProperty(exports, "__esModule", {value: true});` in the future, so that Babel users will use the `default` version.
module.exports.default = Collect
