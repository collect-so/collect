import type {
  CollectQuery,
  CollectRecord,
  CollectRelationTarget,
  CollectSchema,
  InferSchemaTypesWrite
} from '../types'
import type { CollectTransaction } from './transaction'

import { CollectRestApiProxy } from '../api/rest-api-proxy'
import { CollectRecordDraft } from './utils'

export class CollectRecordInstance<
  T extends CollectSchema = CollectSchema
> extends CollectRestApiProxy {
  data: CollectRecord<T>
  searchParams?: CollectQuery<T>
  constructor(data: CollectRecord<T>, searchParams?: CollectQuery<T>) {
    super()
    this.data = data
    this.searchParams = searchParams
  }

  async delete(transaction?: CollectTransaction | string) {
    return await this.apiProxy.records.deleteById(this.data.__id, transaction)
  }

  async update<T extends CollectSchema = CollectSchema>(
    data: CollectRecordDraft | InferSchemaTypesWrite<T>,
    transaction?: CollectTransaction | string
  ) {
    return this.apiProxy.records.update(this.data.__id, data, transaction)
  }

  async patch<T extends CollectSchema = CollectSchema>(
    partialData: CollectRecordDraft | Partial<InferSchemaTypesWrite<T>>,
    transaction?: CollectTransaction | string
  ) {
    return this.apiProxy.records.update(
      this.data.__id,
      partialData instanceof CollectRecordDraft ? partialData : { ...this.data, ...partialData },
      transaction
    )
  }

  async attach(target: CollectRelationTarget, transaction?: CollectTransaction | string) {
    return this.apiProxy.records.attach(this.data.__id, target, transaction)
  }

  async detach(target: CollectRelationTarget, transaction?: CollectTransaction | string) {
    return this.apiProxy.records.detach(this.data.__id, target, transaction)
  }

  // @TODO: Create Related Record (use this as parent);
}

export class CollectRecordsArrayInstance<
  T extends CollectSchema = CollectSchema
> extends CollectRestApiProxy {
  data: CollectRecord<T>[]
  total: number | undefined
  searchParams?: CollectQuery<T>
  constructor(data: CollectRecord<T>[], total?: number, searchParams?: CollectQuery<T>) {
    super()
    this.data = data
    this.total = total
    this.searchParams = searchParams
  }

  // @TODO: Bulk actions: Delete (by ids or searchParams?); Export to csv; Props update for found Records
}
