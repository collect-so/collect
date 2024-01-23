import type { CollectRestAPI } from './rest.api'

export class CollectRestApiProxy {
  protected apiProxy: CollectRestAPI | null = null

  constructor() {
    return new Proxy(this, {
      get: (target, prop, receiver) => {
        if (prop in target) {
          return Reflect.get(target, prop, receiver)
        }
        if (this.apiProxy && prop in this.apiProxy) {
          return Reflect.get(this.apiProxy, prop, receiver)
        }
      }
    })
  }

  init(api: CollectRestAPI) {
    this.apiProxy = api
  }
}
