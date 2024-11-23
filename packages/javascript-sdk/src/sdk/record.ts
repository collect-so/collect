import type {
  AnyObject,
  CollectPropertyType,
  CollectPropertyValue,
  CollectPropertyWithValue,
  CollectQuery,
  CollectSchema,
  FlattenTypes,
  InferSchemaTypesRead,
  InferSchemaTypesWrite,
  MaybeArray,
  OptionalKeysRead,
  RequiredKeysRead
} from '../types/index.js'
import type { CollectTransaction } from './transaction.js'

import { CollectRestApiProxy } from '../api/rest-api-proxy.js'

type CollectRecordInternalProps<Schema extends CollectSchema = CollectSchema> = {
  __id: string
  __label?: string
  __proptypes?: FlattenTypes<
    {
      [Key in RequiredKeysRead<Schema>]: Schema[Key]['type']
    } & {
      [Key in OptionalKeysRead<Schema>]?: Schema[Key]['type']
    }
  >
}

export type CollectRecordProps<Schema extends CollectSchema = CollectSchema> =
  Schema extends CollectSchema ? InferSchemaTypesRead<Schema>
  : {
      [K in keyof Schema]?: Schema[K]
    }

export type CollectRecord<Schema extends CollectSchema = CollectSchema> =
  CollectRecordInternalProps<Schema> & FlattenTypes<CollectRecordProps<Schema>>

export type CollectRelationTarget =
  | CollectRecordsArrayInstance<any>
  | MaybeArray<CollectRecord<any>>
  | MaybeArray<CollectRecordInstance<any>>
  | MaybeArray<string>

export type CollectRelationOptions = { direction?: 'in' | 'out'; type?: string }
export type CollectRelationDetachOptions = Omit<CollectRelationOptions, 'type'> & {
  typeOrTypes?: string | string[]
}

export class CollectBatchDraft {
  label: string
  options?: {
    generateLabels?: boolean
    returnResult?: boolean
    suggestTypes?: boolean
  }
  targetId?: string
  payload: MaybeArray<AnyObject>

  constructor({
    label,
    options = {
      generateLabels: true,
      returnResult: true,
      suggestTypes: true
    },
    payload,
    targetId
  }: {
    label: string
    options?: {
      generateLabels?: boolean
      returnResult?: boolean
      suggestTypes?: boolean
    }
    payload: AnyObject
    targetId?: string
  }) {
    this.label = label
    this.options = options
    this.targetId = targetId
    this.payload = payload
  }

  public toJson() {
    return {
      label: this.label,
      options: this.options,
      payload: this.payload,
      targetId: this.targetId
    }
  }
}

export class CollectRecordDraft {
  label?: string
  targetId?: string
  properties?: Array<{
    metadata?: string
    name: string
    type: CollectPropertyType
    value: CollectPropertyValue
    valueSeparator?: string
  }>

  constructor({
    label,
    properties = [],
    targetId
  }: {
    label?: string
    properties?: Array<
      CollectPropertyWithValue & {
        metadata?: string
        valueSeparator?: string
      }
    >
    targetId?: string
  }) {
    this.label = label
    this.targetId = targetId
    this.properties = properties
  }

  public toJson() {
    return {
      label: this.label,
      properties: this.properties,
      targetId: this.targetId
    }
  }
}

export class CollectRecordInstance<
  Schema extends CollectSchema = CollectSchema
> extends CollectRestApiProxy {
  data?: CollectRecord<Schema>
  searchParams?: CollectQuery<Schema>

  constructor(data?: CollectRecord<Schema>, searchParams?: CollectQuery<Schema>) {
    super()
    this.data = data
    this.searchParams = searchParams
  }

  async delete(transaction?: CollectTransaction | string) {
    if (this.data) {
      return await this.apiProxy.records.deleteById(this.data.__id, transaction)
    }
  }

  async update<Schema extends CollectSchema = CollectSchema>(
    data: CollectRecordDraft | InferSchemaTypesWrite<Schema>,
    transaction?: CollectTransaction | string
  ) {
    if (this.data) {
      return this.apiProxy.records.update(this.data.__id, data, transaction)
    }
  }

  async patch<Schema extends CollectSchema = CollectSchema>(
    partialData: CollectRecordDraft | Partial<InferSchemaTypesWrite<Schema>>,
    transaction?: CollectTransaction | string
  ) {
    if (this.data) {
      return this.apiProxy.records.update(
        this.data.__id,
        partialData instanceof CollectRecordDraft ? partialData : { ...this.data, ...partialData },
        transaction
      )
    }
  }

  async attach(
    target: CollectRelationTarget,
    options?: CollectRelationOptions,
    transaction?: CollectTransaction | string
  ) {
    if (this.data) {
      return this.apiProxy.records.attach(this.data.__id, target, options, transaction)
    }
  }

  async detach(
    target: CollectRelationTarget,
    options?: CollectRelationDetachOptions,
    transaction?: CollectTransaction | string
  ) {
    if (this.data) {
      return this.apiProxy.records.detach(this.data.__id, target, options, transaction)
    }
  }

  // @TODO: Create Related Record (use this as parent); Upload file;
}

export class CollectRecordsArrayInstance<
  Schema extends CollectSchema = CollectSchema
> extends CollectRestApiProxy {
  data?: CollectRecord<Schema>[]
  total: number | undefined
  searchParams?: CollectQuery<Schema>

  constructor(data?: CollectRecord<Schema>[], total?: number, searchParams?: CollectQuery<Schema>) {
    super()
    this.data = data
    this.total = total
    this.searchParams = searchParams
  }

  // @TODO: Bulk actions: Delete (by ids or searchParams?); Export to csv; Props update for found Records; Attach/Detach
}
