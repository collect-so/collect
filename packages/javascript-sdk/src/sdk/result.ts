import type { CollectObject, CollectQuery, CollectRecord, CollectSchema } from '@collect.so/types'

import { CollectRestApiProxy } from '../api/rest-api-proxy'

export class CollectRecordResult<
  T extends CollectObject | CollectSchema = CollectObject
> extends CollectRestApiProxy {
  data: CollectRecord<T>
  requestData?: CollectQuery<T>
  constructor(data: CollectRecord<T>, requestData?: CollectQuery<T>) {
    super()
    this.data = data
    this.requestData = requestData
  }

  // @TODO: Update Record; Delete Record; Create Relation; Create Related Record (use this as parent);
}

export class CollectRecordsArrayResult<
  T extends CollectObject | CollectSchema = CollectObject
> extends CollectRestApiProxy {
  data: CollectRecord<T>[]
  requestData?: CollectQuery<T>
  constructor(data: CollectRecord<T>[], requestData?: CollectQuery<T>) {
    super()
    this.data = data
    this.requestData = requestData
  }

  // @TODO: Bulk actions: Delete (by ids or searchParams?); Export to csv; ...
}
