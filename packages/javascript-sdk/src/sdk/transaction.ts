import { CollectRestApiProxy } from '../api/rest-api-proxy.js'

export class CollectTransaction extends CollectRestApiProxy {
  readonly id: string

  constructor(id: string) {
    super()
    this.id = id
  }

  async rollback() {
    return await this.apiProxy.tx.rollback(this.id)
  }

  async commit() {
    return await this.apiProxy.tx.commit(this.id)
  }
}
