import { CollectSDK } from '@collect/sdk'

const sdk = new CollectSDK()

console.log({
  create: sdk.create('test', {})
})
