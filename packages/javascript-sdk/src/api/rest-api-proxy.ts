import type { CollectRestAPI } from './api'

export class CollectRestApiProxy {
  protected apiProxy: CollectRestAPI = {} as CollectRestAPI

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

  init(api: CollectRestAPI, methodsWhiteList?: []) {
    this.apiProxy = api
  }
}
