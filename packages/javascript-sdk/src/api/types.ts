import type {
  CollectBatchDraft,
  CollectRecordDraft,
  CollectRecordInstance,
  CollectRecordsArrayInstance,
  CollectRelationTarget,
  CollectRelationOptions,
  CollectRelationDetachOptions
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
    sourceId: string,
    target: CollectRelationTarget,
    options?: CollectRelationOptions,
    transaction?: CollectTransaction | string
  ): Promise<CollectApiResponse<{ message: string }>>

  create<Schema extends CollectSchema = any>(
    data: CollectRecordDraft | InferSchemaTypesWrite<Schema>,
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordInstance<Schema>>

  create<Schema extends CollectSchema = any>(
    label: string,
    data?: InferSchemaTypesWrite<Schema>,
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordInstance<Schema>>
  create<Schema extends CollectSchema = any>(
    labelOrData: CollectRecordDraft | Schema | string,
    maybeDataOrTransaction?: CollectTransaction | Schema | string,
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordInstance<Schema>>

  createMany<Schema extends CollectSchema = any>(
    data: CollectBatchDraft | InferSchemaTypesWrite<Schema>[],
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordsArrayInstance<Schema>>
  createMany<Schema extends CollectSchema = any>(
    label: string,
    data?: CollectBatchDraft | InferSchemaTypesWrite<Schema>[],
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordsArrayInstance<Schema>>
  createMany<Schema extends CollectSchema = any>(
    labelOrData: CollectBatchDraft | MaybeArray<InferSchemaTypesWrite<Schema>> | string,
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
    sourceId: string,
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
    searchParams: CollectQuery<Schema>,
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordInstance<Schema>>
  findOne<Schema extends CollectSchema = any>(
    labelOrSearchParams: CollectQuery<Schema> | string,
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordInstance<Schema>>
  findOne<Schema extends CollectSchema = any>(
    searchParams: CollectQuery<Schema>,
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordInstance<Schema>>

  properties(
    id: string,
    transaction?: CollectTransaction | string
  ): Promise<CollectApiResponse<CollectProperty[]>>

  relations(
    id: string,
    transaction?: CollectTransaction | string
  ): Promise<
    CollectApiResponse<
      Array<{
        relations: Array<{ count: number; label: string }>
        type: string
      }>
    >
  >

  update<Schema extends CollectSchema = any>(
    id: string,
    data: CollectRecordDraft | InferSchemaTypesWrite<Schema>,
    transaction?: CollectTransaction | string
  ): Promise<CollectRecordInstance<Schema>>
}
