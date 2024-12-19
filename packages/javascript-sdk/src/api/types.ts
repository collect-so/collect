import type {
  CollectBatchDraft,
  CollectRecordDraft,
  CollectRecordInstance,
  CollectRecordTarget,
  CollectRecordsArrayInstance,
  CollectRelation,
  CollectRelationDetachOptions,
  CollectRelationOptions,
  CollectRelationTarget
} from '../sdk/record.js'
import type { CollectTransaction } from '../sdk/transaction.js'
import type {
  CollectProperty,
  CollectQuery,
  CollectSchema,
  InferSchemaTypesWrite,
  MaybeArray
} from '../types/index.js'

export type CollectApiResponse<T, E = Record<string, any>> = {
  data: T
  success: boolean
  total?: number
} & E

export type CollectRecordsApi = {
  attach(
    source: CollectRecordTarget,
    target: CollectRelationTarget,
    options?: CollectRelationOptions,
    transaction?: CollectTransaction | string
  ): Promise<CollectApiResponse<{ message: string }>>

  create<Schema extends CollectSchema = any>(
    label: string,
    data: InferSchemaTypesWrite<Schema>,
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordInstance<Schema>>
  create<Schema extends CollectSchema = any>(
    labelOrData: CollectRecordDraft | string,
    maybeDataOrTransaction?: CollectTransaction | InferSchemaTypesWrite<Schema> | string,
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordInstance<Schema>>

  createMany<Schema extends CollectSchema = any>(
    label: string,
    data: InferSchemaTypesWrite<Schema>[],
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordsArrayInstance<Schema>>
  createMany<Schema extends CollectSchema = any>(
    labelOrData: CollectBatchDraft | string,
    maybeDataOrTransaction?:
      | CollectTransaction
      | MaybeArray<InferSchemaTypesWrite<Schema>>
      | string,
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordsArrayInstance<Schema>>

  delete<Schema extends CollectSchema = any>(
    searchParams: CollectQuery<Schema>,
    transaction?: CollectTransaction | string
  ): Promise<CollectApiResponse<{ message: string }>>

  deleteById(
    idOrIds: MaybeArray<string>,
    transaction?: CollectTransaction | string
  ): Promise<CollectApiResponse<{ message: string }>>

  detach(
    source: CollectRecordTarget,
    target: CollectRelationTarget,
    options?: CollectRelationDetachOptions,
    transaction?: CollectTransaction | string
  ): Promise<CollectApiResponse<{ message: string }>>

  export<Schema extends CollectSchema = any>(
    searchParams?: CollectQuery<Schema>,
    transaction?: CollectTransaction | string
  ): Promise<CollectApiResponse<{ dateTime: string; fileContent: string }>>

  find<Schema extends CollectSchema = any>(
    label: string,
    searchParams?: CollectQuery<Schema>,
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordsArrayInstance<Schema>>
  find<Schema extends CollectSchema = any>(
    labelOrSearchParams: CollectQuery<Schema> | string,
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordsArrayInstance<Schema>>
  find<Schema extends CollectSchema = any>(
    searchParams: CollectQuery<Schema>,
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordsArrayInstance<Schema>>

  findById<Schema extends CollectSchema = any>(
    id: string,
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordInstance<Schema>>
  findById<Schema extends CollectSchema = any>(
    ids: string[],
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordsArrayInstance<Schema>>

  findOne<Schema extends CollectSchema = any>(
    label: string,
    searchParams: CollectQuery<Schema> & { limit?: never; skip?: never },
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordInstance<Schema>>
  findOne<Schema extends CollectSchema = any>(
    labelOrSearchParams: (CollectQuery<Schema> & { limit?: never; skip?: never }) | string,
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordInstance<Schema>>
  findOne<Schema extends CollectSchema = any>(
    searchParams: CollectQuery<Schema> & { limit?: never; skip?: never },
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordInstance<Schema>>

  properties(
    target: CollectRecordTarget,
    transaction?: CollectTransaction | string
  ): Promise<CollectApiResponse<CollectProperty[]>>

  relations(
    target: CollectRecordTarget,
    transaction?: CollectTransaction | string
  ): Promise<CollectApiResponse<Array<CollectRelation>>>

  // overwrite whole record
  set<Schema extends CollectSchema = any>(
    target: CollectRecordTarget,
    data: CollectRecordDraft | InferSchemaTypesWrite<Schema>,
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordInstance<Schema>>

  // partially update
  update<Schema extends CollectSchema = any>(
    target: CollectRecordTarget,
    data: CollectRecordDraft | Partial<InferSchemaTypesWrite<Schema>>,
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordInstance<Schema>>
}
