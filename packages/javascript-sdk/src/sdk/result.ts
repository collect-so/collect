import type { CollectObject, CollectQuery, CollectRecord, CollectSchema } from '@collect.so/types'

import type { CollectTransaction } from './transaction'
import type { CollectRecordObject } from './utils'

import { CollectRestApiProxy } from '../api/rest-api-proxy'

export class CollectRecordResult<
  T extends CollectObject | CollectSchema = CollectObject
> extends CollectRestApiProxy {
  data: CollectRecord<T>
  searchParams?: CollectQuery<T>
  constructor(data: CollectRecord<T>, searchParams?: CollectQuery<T>) {
    super()
    this.data = data
    this.searchParams = searchParams
  }

  async delete(transaction?: CollectTransaction | string) {
    return await this.apiProxy.records.deleteById(this.data._collect_id, transaction)
  }

  async update<T extends CollectObject = CollectObject>(
    data: CollectRecordObject | T,
    transaction?: CollectTransaction | string
  ) {
    return this.apiProxy.records.update(this.data._collect_id, data, transaction)
  }

  // @TODO: Create Relation; Create Related Record (use this as parent);
}

export class CollectRecordsArrayResult<
  T extends CollectObject | CollectSchema = CollectObject
> extends CollectRestApiProxy {
  data: CollectRecord<T>[]
  total: number | undefined
  searchParams?: CollectQuery<T>
  constructor(data: CollectRecord<T>[], total?: number, searchParams?: CollectQuery<T>) {
    super()
    // @TODO: Map Records to Result-like class to have properties along with single Record methods on each item
    this.data = data
    this.total = total
    this.searchParams = searchParams
  }

  // @TODO: Bulk actions: Delete (by ids or searchParams?); Export to csv; Props update for found Records
}
