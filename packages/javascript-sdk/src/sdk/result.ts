import type {
  CollectObject,
  CollectQuery,
  CollectSchema
} from '@collect.so/types'

import { CollectRestApiProxy } from '../api/rest-api-proxy'

export class CollectResult<
  T extends CollectObject
> extends CollectRestApiProxy {
  data: T
  requestData?: CollectQuery<T>
  constructor(data: T, requestData?: CollectQuery<T>) {
    super()
    this.data = data
    this.requestData = requestData
  }
}

export class CollectArrayResult<
  T extends CollectObject = CollectObject
> extends CollectRestApiProxy {
  data: T[]
  requestData?: CollectQuery<T>
  constructor(data: T[], requestData?: CollectQuery<T>) {
    super()
    this.data = data
    this.requestData = requestData
  }
}
