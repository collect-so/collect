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
  __label: string
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

// For set, update, attach, detach, delete methods (extending plain id: string)
export type CollectRecordTarget = CollectRecord<any> | CollectRecordInstance<any> | string

export type CollectRelationTarget =
  | CollectRecordsArrayInstance<any>
  | MaybeArray<CollectRecord<any>>
  | MaybeArray<CollectRecordInstance<any>>
  | MaybeArray<string>

export type RelationDirection = 'in' | 'out'
export type CollectRelationOptions = { direction?: RelationDirection; type?: string }
export type CollectRelationDetachOptions = {
  direction?: RelationDirection
  typeOrTypes?: string | string[]
}

export class CollectBatchDraft {
  label: string
  options?: {
    generateLabels?: boolean
    returnResult?: boolean
    suggestTypes?: boolean
  }
  payload: MaybeArray<AnyObject>

  constructor({
    label,
    options = {
      generateLabels: true,
      returnResult: true,
      suggestTypes: true
    },
    payload
  }: {
    label: string
    options?: {
      generateLabels?: boolean
      returnResult?: boolean
      suggestTypes?: boolean
    }
    payload: AnyObject
  }) {
    this.label = label
    this.options = options
    this.payload = payload
  }

  public toJson() {
    return {
      label: this.label,
      options: this.options,
      payload: this.payload
    }
  }
}

export class CollectRecordDraft {
  label: string
  properties?: Array<{
    metadata?: string
    name: string
    type: CollectPropertyType
    value: CollectPropertyValue
    valueSeparator?: string
  }>

  constructor({
    label,
    properties = []
  }: {
    label: string
    properties?: Array<
      CollectPropertyWithValue & {
        metadata?: string
        valueSeparator?: string
      }
    >
    relation?: CollectRelationOptions
  }) {
    this.label = label
    this.properties = properties
  }

  public toJson() {
    return {
      label: this.label,
      properties: this.properties
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
    partialData: CollectRecordDraft | Partial<InferSchemaTypesWrite<Schema>>,
    transaction?: CollectTransaction | string
  ) {
    if (this.data) {
      return this.apiProxy.records.update(this.data.__id, partialData, transaction)
    }
  }
  async set<Schema extends CollectSchema = CollectSchema>(
    data: CollectRecordDraft | InferSchemaTypesWrite<Schema>,
    transaction?: CollectTransaction | string
  ) {
    if (this.data) {
      return this.apiProxy.records.set(this.data.__id, data, transaction)
    }
  }

  async attach(
    relationConfig: {
      target: CollectRelationTarget
      options?: CollectRelationOptions
    },
    transaction?: CollectTransaction | string
  ) {
    if (this.data) {
      return this.apiProxy.records.attach(
        {
          source: this.data.__id,
          target: relationConfig.target,
          options: relationConfig.options
        },
        transaction
      )
    }
  }

  async detach(
    relationConfig: {
      target: CollectRelationTarget
      options?: CollectRelationDetachOptions
    },
    transaction?: CollectTransaction | string
  ) {
    if (this.data) {
      return this.apiProxy.records.detach(
        {
          source: this.data.__id,
          target: relationConfig.target,
          options: relationConfig.options
        },
        transaction
      )
    }
  }
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
