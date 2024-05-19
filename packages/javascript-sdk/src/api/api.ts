import type { CollectSchema } from '../common/types'
import type { HttpClient } from '../network/HttpClient'
import type { UserProvidedConfig } from '../sdk/types'
import type {
  CollectProperty,
  CollectPropertyValue,
  CollectQuery,
  CollectRecord,
  CollectRelationTarget,
  Enumerable,
  InferSchemaTypesWrite
} from '../types'
import type { CollectApiResponse } from './types'

import { buildUrl, isArray, isObject, isObjectFlat, isString } from '../common/utils'
import { createFetcher } from '../network'
import { EmptyTargetError } from '../sdk/errors'
import { CollectRecordInstance, CollectRecordsArrayInstance } from '../sdk/instance'
import { CollectTransaction } from '../sdk/transaction'
import { CollectBatchDraft, CollectRecordDraft } from '../sdk/utils'
import { createApi } from './create-api'
import { createSearchParams, isTransaction, normalizeRecord, pickTransaction } from './utils'

export class CollectRestAPI {
  public api: ReturnType<typeof createApi>
  public fetcher: ReturnType<typeof createFetcher>

  public records: {
    attach(
      sourceId: string,
      target: CollectRelationTarget,
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<{ message: string }>>

    create<T extends CollectSchema = any>(
      data: CollectRecordDraft | InferSchemaTypesWrite<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordInstance<T>>

    create<T extends CollectSchema = any>(
      label: string,
      data?: InferSchemaTypesWrite<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordInstance<T>>
    create<T extends CollectSchema = any>(
      labelOrData: CollectRecordDraft | T | string,
      maybeDataOrTransaction?: CollectTransaction | T | string,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordInstance<T>>

    createMany<T extends CollectSchema = any>(
      data: CollectBatchDraft | InferSchemaTypesWrite<T>[],
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordsArrayInstance<T>>
    createMany<T extends CollectSchema = any>(
      label: string,
      data?: CollectBatchDraft | InferSchemaTypesWrite<T>[],
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordsArrayInstance<T>>
    createMany<T extends CollectSchema = any>(
      labelOrData: CollectBatchDraft | Enumerable<InferSchemaTypesWrite<T>> | string,
      maybeDataOrTransaction?: CollectTransaction | Enumerable<InferSchemaTypesWrite<T>> | string,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordsArrayInstance<T>>

    delete<T extends CollectSchema = any>(
      searchParams: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<{ message: string }>>

    deleteById(
      idOrIds: Enumerable<string>,
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<{ message: string }>>

    detach(
      sourceId: string,
      target: CollectRelationTarget,
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<{ message: string }>>

    export<T extends CollectSchema = any>(
      searchParams?: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<{ dateTime: string; fileContent: string }>>

    find<T extends CollectSchema = any>(
      label: string,
      searchParams?: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordsArrayInstance<T>>
    find<T extends CollectSchema = any>(
      labelOrSearchParams: CollectQuery<T> | string,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordsArrayInstance<T>>
    find<T extends CollectSchema = any>(
      searchParams: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordsArrayInstance<T>>

    findById<T extends CollectSchema = any>(
      id: string,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordInstance<T>>
    findById<T extends CollectSchema = any>(
      ids: string[],
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordsArrayInstance<T>>

    findOne<T extends CollectSchema = any>(
      label: string,
      searchParams: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordInstance<T>>
    findOne<T extends CollectSchema = any>(
      labelOrSearchParams: CollectQuery<T> | string,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordInstance<T>>
    findOne<T extends CollectSchema = any>(
      searchParams: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordInstance<T>>

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

    update<T extends CollectSchema = any>(
      id: string,
      data: CollectRecordDraft | InferSchemaTypesWrite<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordInstance<T>>
  }

  constructor(token?: string, config?: UserProvidedConfig & { httpClient: HttpClient }) {
    this.fetcher = null as unknown as ReturnType<typeof createFetcher>

    if (config?.httpClient) {
      const url = buildUrl(config)
      this.fetcher = createFetcher({
        httpClient: config.httpClient,
        token,
        url
      })
    }
    this.api = createApi(this.fetcher)

    this.records = {
      attach: async (
        sourceId: string,
        target: CollectRelationTarget,
        transaction?: CollectTransaction | string
      ) => {
        // target is Enumerable<CollectRecordInstance>
        if (target instanceof CollectRecordInstance) {
          const id = target.data?.__id
          if (id) {
            return await this.api.records.attach(sourceId, id, transaction)
          } else {
            throw new EmptyTargetError('Attach error: Target id is empty')
          }
        } else if (isArray(target) && target.every((r) => r instanceof CollectRecordInstance)) {
          const ids = target.map((r) => (r as CollectRecordInstance).data.__id).filter(Boolean)
          if (ids.length) {
            return await this.api.records.attach(sourceId, ids, transaction)
          } else {
            throw new EmptyTargetError('Attach error: Target ids are empty')
          }
        }

        // target is CollectRecordsArrayInstance
        else if (target instanceof CollectRecordsArrayInstance) {
          const ids = target.data?.map((r) => r.__id).filter(Boolean)
          if (ids?.length) {
            return await this.api.records.attach(sourceId, ids, transaction)
          } else {
            throw new EmptyTargetError('Attach error: Target ids are empty')
          }
        }

        // target is Enumerable<CollectRecord>
        else if (isObject(target) && '__id' in target) {
          return await this.api.records.attach(sourceId, target.__id, transaction)
        } else if (isArray(target) && target.every((r) => isObject(r) && '__id' in r)) {
          const ids = target?.map((r) => (r as CollectRecord).__id).filter(Boolean)
          if (ids?.length) {
            return await this.api.records.attach(sourceId, ids, transaction)
          } else {
            throw new EmptyTargetError('Attach error: Target ids are empty')
          }
        }

        // target is Enumerable<string>
        else {
          return await this.api.records.attach(sourceId, target as Enumerable<string>, transaction)
        }
      },

      create: async <T extends CollectSchema = any>(
        labelOrData: CollectRecordDraft | InferSchemaTypesWrite<T> | string,
        maybeDataOrTransaction?: CollectTransaction | InferSchemaTypesWrite<T> | string,
        transaction?: CollectTransaction | string
      ): Promise<CollectRecordInstance<T>> => {
        let response

        if (labelOrData instanceof CollectRecordDraft) {
          response = await this.api?.records.create<T>(
            labelOrData,
            pickTransaction(maybeDataOrTransaction)
          )
        }

        if (!response && isObjectFlat(labelOrData)) {
          const normalizedRecord = normalizeRecord({
            payload: labelOrData as Record<string, CollectPropertyValue>
          })

          response = await this.api?.records.create<T>(
            new CollectRecordDraft(normalizedRecord),
            pickTransaction(maybeDataOrTransaction)
          )
        } else if (isObject(labelOrData)) {
          throw Error('Provided data is not a flat object. Consider to use `createMany` method.')
        }

        if (!response && isString(labelOrData)) {
          if (isObjectFlat(maybeDataOrTransaction)) {
            const normalizedRecord = normalizeRecord({
              label: labelOrData,
              payload: maybeDataOrTransaction as Record<string, CollectPropertyValue>
            })

            response = await this.api?.records.create<T>(
              new CollectRecordDraft(normalizedRecord),
              transaction
            )
          } else if (isObject(maybeDataOrTransaction)) {
            throw Error('Provided data is not a flat object. Consider to use `createMany` method.')
          }
        }

        if (response?.success && response?.data) {
          const result = new CollectRecordInstance<T>(response.data)
          result.init(this)
          return result
        }

        return new CollectRecordInstance<T>({} as CollectRecord<T>)
      },

      createMany: async <T extends CollectSchema = any>(
        labelOrData: CollectBatchDraft | Enumerable<InferSchemaTypesWrite<T>> | string,
        maybeDataOrTransaction?: CollectTransaction | Enumerable<InferSchemaTypesWrite<T>> | string,
        transaction?: CollectTransaction | string
      ): Promise<CollectRecordsArrayInstance<T>> => {
        let response

        if (labelOrData instanceof CollectBatchDraft) {
          response = await this.api?.records.createMany<T>(
            labelOrData,
            pickTransaction(maybeDataOrTransaction)
          )
        }

        if (!response && (isArray(labelOrData) || isObject(labelOrData))) {
          const data = new CollectBatchDraft({
            payload: labelOrData
          })

          response = await this.api?.records.createMany<T>(
            data,
            pickTransaction(maybeDataOrTransaction)
          )
        }

        if (
          !response &&
          isString(labelOrData) &&
          (isArray(maybeDataOrTransaction) || isObject(maybeDataOrTransaction))
        ) {
          const data = new CollectBatchDraft({
            label: labelOrData,
            payload: maybeDataOrTransaction
          })
          response = await this.api?.records.createMany<T>(data, transaction)
        }

        if (response?.success && response?.data) {
          const result = new CollectRecordsArrayInstance<T>(response.data, response.total)
          result.init(this)
          return result
        }

        return new CollectRecordsArrayInstance<T>([])
      },

      delete: async <T extends CollectSchema = any>(
        searchParams: CollectQuery<T>,
        transaction?: CollectTransaction | string
      ) => {
        return this.api?.records.delete(searchParams, transaction)
      },

      deleteById: async (ids: Enumerable<string>, transaction?: CollectTransaction | string) => {
        return this.api?.records.deleteById(ids, transaction)
      },

      detach: async (
        sourceId: string,
        target: CollectRelationTarget,
        transaction?: CollectTransaction | string
      ) => {
        // target is Enumerable<CollectRecordInstance>
        if (target instanceof CollectRecordInstance) {
          const id = target.data?.__id
          if (id) {
            return await this.api.records.detach(sourceId, id, transaction)
          } else {
            throw new EmptyTargetError('Detach error: Target id is empty')
          }
        } else if (isArray(target) && target.every((r) => r instanceof CollectRecordInstance)) {
          const ids = target.map((r) => (r as CollectRecordInstance).data.__id).filter(Boolean)
          if (ids.length) {
            return await this.api.records.detach(sourceId, ids, transaction)
          } else {
            throw new EmptyTargetError('Detach error: Target ids are empty')
          }
        }

        // target is CollectRecordsArrayInstance
        else if (target instanceof CollectRecordsArrayInstance) {
          const ids = target.data?.map((r) => r.__id).filter(Boolean)
          if (ids?.length) {
            return await this.api.records.detach(sourceId, ids, transaction)
          } else {
            throw new EmptyTargetError('Detach error: Target ids are empty')
          }
        }

        // target is Enumerable<CollectRecord>
        else if (isObject(target) && '__id' in target) {
          return await this.api.records.detach(sourceId, target.__id, transaction)
        } else if (isArray(target) && target.every((r) => isObject(r) && '__id' in r)) {
          const ids = target?.map((r) => (r as CollectRecord).__id).filter(Boolean)
          if (ids?.length) {
            return await this.api.records.detach(sourceId, ids, transaction)
          } else {
            throw new EmptyTargetError('Detach error: Target ids are empty')
          }
        }

        // target is Enumerable<string>
        else {
          return await this.api.records.detach(sourceId, target as Enumerable<string>, transaction)
        }
      },

      export: async <T extends CollectSchema = any>(
        searchParams: CollectQuery<T>,
        transaction?: CollectTransaction | string
      ) => {
        return this.api?.records.export(searchParams, transaction)
      },

      find: async <T extends CollectSchema = any>(
        labelOrSearchParams?: CollectQuery<T> | string,
        searchParamsOrTransaction?: CollectQuery<T> | CollectTransaction | string,
        transaction?: CollectTransaction | string
      ): Promise<CollectRecordsArrayInstance<T>> => {
        const isTransactionParam = isTransaction(searchParamsOrTransaction)
        const { id, searchParams } = createSearchParams<T>(
          labelOrSearchParams,
          searchParamsOrTransaction
        )
        const tx = isTransactionParam ? searchParamsOrTransaction : transaction
        const response = await this.api?.records.find<T>({ id, searchParams }, tx)

        const result = new CollectRecordsArrayInstance<T>(
          response.data,
          response.total,
          searchParamsOrTransaction as CollectQuery<T>
        )
        result.init(this)
        return result
      },

      findById: async <
        T extends CollectSchema = CollectSchema,
        Arg extends Enumerable<string> = Enumerable<string>,
        R = Arg extends string[] ? CollectRecordsArrayInstance<T> : CollectRecordInstance<T>
      >(
        idOrIds: Arg,
        transaction?: CollectTransaction | string
      ): Promise<R> => {
        if (isArray(idOrIds)) {
          const response = (await this.api?.records.findById<T>(
            idOrIds,
            transaction
          )) as CollectApiResponse<CollectRecord<T>[]>
          const result = new CollectRecordsArrayInstance<T>(response.data, response.total)
          result.init(this)
          return result as R
        } else {
          const response = (await this.api?.records.findById<T>(
            idOrIds,
            transaction
          )) as CollectApiResponse<CollectRecord<T>>
          const result = new CollectRecordInstance<T>(response.data)
          result.init(this)
          return result as R
        }
      },

      findOne: async <T extends CollectSchema = any>(
        labelOrSearchParams?: CollectQuery<T> | string,
        searchParamsOrTransaction?: CollectQuery<T> | CollectTransaction | string,
        transaction?: CollectTransaction | string
      ): Promise<CollectRecordInstance<T>> => {
        const isTransactionParam = isTransaction(searchParamsOrTransaction)
        const { searchParams } = createSearchParams<T>(
          labelOrSearchParams,
          searchParamsOrTransaction
        )
        const tx = isTransactionParam ? searchParamsOrTransaction : transaction
        const response = await this.api?.records.findOne<T>(searchParams, tx)

        const result = new CollectRecordInstance<T>(
          response.data,
          searchParamsOrTransaction as CollectQuery<T>
        )
        result.init(this)
        return result
      },

      properties: async (id: string, transaction?: CollectTransaction | string) => {
        return this.api?.records.properties(id, transaction)
      },

      relations: async (id: string, transaction?: CollectTransaction | string) => {
        return await this.api.records.relations(id, transaction)
      },

      update: async <T extends CollectSchema = any>(
        id: string,
        data: CollectRecordDraft | InferSchemaTypesWrite<T>,
        transaction?: CollectTransaction | string
      ) => {
        let response

        if (data instanceof CollectRecordDraft) {
          response = await this.api?.records.update<T>(id, data, transaction)
        } else if (isObjectFlat(data)) {
          const normalizedRecord = normalizeRecord({
            payload: data as Record<string, CollectPropertyValue>
          })
          response = await this.api?.records.update<T>(
            id,
            new CollectRecordDraft(normalizedRecord),
            transaction
          )
        } else if (isObject(data)) {
          throw Error('Provided data is not a flat object. Consider to use `createMany` method.')
        }

        if (response?.success && response?.data) {
          const result = new CollectRecordInstance<T>(response.data)
          result.init(this)
          return result
        }

        return new CollectRecordInstance<T>({} as CollectRecord<T>)
      }
    }
  }

  public properties = {
    delete: async (id: string, transaction?: CollectTransaction | string) => {
      return this.api?.properties.delete(id, transaction)
    },
    find: async <T extends CollectSchema = any>(
      searchParams: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ) => {
      return this.api?.properties.find<T>(searchParams, transaction)
    },
    findById: async (id: string, transaction?: CollectTransaction | string) => {
      return this.api?.properties.values(id, transaction)
    },
    values: async (id: string, transaction?: CollectTransaction | string) => {
      return this.api?.properties.values(id, transaction)
    }
  }

  public labels = {
    find: async <T extends CollectSchema = any>(
      searchParams: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ) => {
      return this.api.labels.find<T>(searchParams, transaction)
    }
  }

  public tx = {
    begin: async (config?: Partial<{ ttl: number }>) => {
      const transaction = await this.api?.tx.begin(config)

      const result = new CollectTransaction(transaction.data.id)
      result.init(this)
      return result
    },
    commit: async (id: string) => this.api?.tx.commit(id),
    get: async (id: string) => {
      const transaction = await this.api?.tx.get(id)

      const result = new CollectTransaction(transaction.data.id)
      result.init(this)
      return result
    },
    rollback: async (id: string) => this.api?.tx.commit(id)
  }
}
