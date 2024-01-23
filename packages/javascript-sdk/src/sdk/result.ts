import type { CollectQuery } from '@collect.so/types'

import { CollectRestApiProxy } from '../api/rest-api-proxy'

export class CollectResult<
  T extends object = object
> extends CollectRestApiProxy {
  data: T
  requestData?: CollectQuery<T>
  constructor(data: T, requestData?: CollectQuery<T>) {
    super()
    this.data = data
    this.requestData = requestData
  }
}
