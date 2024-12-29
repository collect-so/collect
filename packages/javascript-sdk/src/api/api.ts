import type { HttpClient } from '../network/HttpClient.js'
import type {
  CollectRecord,
  CollectRelationDetachOptions,
  CollectRelationOptions,
  CollectRelationTarget
} from '../sdk/record.js'
import type { UserProvidedConfig } from '../sdk/types.js'
import type {
  CollectPropertyValue,
  CollectPropertyWithValue,
  CollectQuery,
  CollectSchema,
  InferSchemaTypesWrite,
  MaybeArray
} from '../types/index.js'
import type { CollectApiResponse, CollectRecordsApi } from './types.js'

import {
  isArray,
  isEmptyObject,
  isObject,
  isObjectFlat,
  isString,
  toBoolean
} from '../common/utils.js'
import { createFetcher } from '../network/index.js'
import { EmptyTargetError } from '../sdk/errors.js'
import {
  CollectBatchDraft,
  CollectRecordDraft,
  CollectRecordInstance,
  CollectRecordsArrayInstance
} from '../sdk/record.js'
import { CollectTransaction } from '../sdk/transaction.js'
import { createApi } from './create-api.js'
import {
  buildUrl,
  createSearchParams,
  isTransaction,
  normalizeRecord,
  pickTransaction,
  prepareProperties
} from './utils.js'

export class CollectRestAPI {
  public api: ReturnType<typeof createApi>
  public fetcher: ReturnType<typeof createFetcher>

  public records: CollectRecordsApi

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
        relationConfig: {
          source: string
          target: CollectRelationTarget
          options?: CollectRelationOptions
        },
        transaction?: CollectTransaction | string
      ) => {
        // target is MaybeArray<CollectRecordInstance>
        if (relationConfig.target instanceof CollectRecordInstance) {
          const id = relationConfig.target.data?.__id
          if (id) {
            return await this.api.records.attach(
              {
                source: relationConfig.source,
                idOrIds: id,
                options: relationConfig.options
              },
              transaction
            )
          } else {
            throw new EmptyTargetError('Attach error: Target id is empty')
          }
        } else if (
          isArray(relationConfig.target) &&
          relationConfig.target.every((r) => r instanceof CollectRecordInstance)
        ) {
          const ids = relationConfig.target
            .map((r) => (r as CollectRecordInstance).data?.__id)
            .filter(toBoolean)
          if (ids.length) {
            return await this.api.records.attach(
              {
                source: relationConfig.source,
                idOrIds: ids as string[],
                options: relationConfig.options
              },
              transaction
            )
          } else {
            throw new EmptyTargetError('Attach error: Target ids are empty')
          }
        }

        // target is CollectRecordsArrayInstance
        else if (relationConfig.target instanceof CollectRecordsArrayInstance) {
          const ids = relationConfig.target.data?.map((r) => r.__id).filter(Boolean)
          if (ids?.length) {
            return await this.api.records.attach(
              {
                source: relationConfig.source,
                idOrIds: ids,
                options: relationConfig.options
              },
              transaction
            )
          } else {
            throw new EmptyTargetError('Attach error: Target ids are empty')
          }
        }

        // target is MaybeArray<CollectRecord>
        else if (isObject(relationConfig.target) && '__id' in relationConfig.target) {
          return await this.api.records.attach(
            {
              source: relationConfig.source,
              idOrIds: relationConfig.target.__id,
              options: relationConfig.options
            },
            transaction
          )
        } else if (
          isArray(relationConfig.target) &&
          relationConfig.target.every((r) => isObject(r) && '__id' in r)
        ) {
          const ids = relationConfig.target?.map((r) => (r as CollectRecord).__id).filter(Boolean)
          if (ids?.length) {
            return await this.api.records.attach(
              {
                source: relationConfig.source,
                idOrIds: ids,
                options: relationConfig.options
              },
              transaction
            )
          } else {
            throw new EmptyTargetError('Attach error: Target ids are empty')
          }
        }

        // target is MaybeArray<string>
        else {
          return await this.api.records.attach(
            {
              source: relationConfig.source,
              idOrIds: relationConfig.target as MaybeArray<string>,
              options: relationConfig.options
            },
            transaction
          )
        }
      },

      create: async <Schema extends CollectSchema = any>(
        labelOrData: CollectRecordDraft | string,
        maybeDataOrTransaction?: CollectTransaction | InferSchemaTypesWrite<Schema> | string,
        transaction?: CollectTransaction | string
      ): Promise<CollectRecordInstance<Schema>> => {
        let response

        if (labelOrData instanceof CollectRecordDraft) {
          response = await this.api?.records.create<Schema>(
            labelOrData,
            pickTransaction(maybeDataOrTransaction)
          )
        }

        if (!response && isString(labelOrData)) {
          if (isObjectFlat(maybeDataOrTransaction)) {
            const normalizedRecord = normalizeRecord({
              label: labelOrData,
              payload: maybeDataOrTransaction as Record<string, CollectPropertyValue>
            })

            response = await this.api?.records.create<Schema>(
              new CollectRecordDraft(
                normalizedRecord as { label: string; properties: CollectPropertyWithValue[] }
              ),
              transaction
            )
          } else if (isObject(maybeDataOrTransaction)) {
            throw Error('Provided data is not a flat object. Consider to use `createMany` method.')
          }
        }

        if (response?.success && response?.data) {
          const result = new CollectRecordInstance<Schema>(response.data)
          result.init(this)
          return result
        }

        return new CollectRecordInstance<Schema>()
      },

      createMany: async <Schema extends CollectSchema = any>(
        labelOrData: CollectBatchDraft | string,
        maybeDataOrTransaction?:
          | CollectTransaction
          | MaybeArray<InferSchemaTypesWrite<Schema>>
          | string,
        transaction?: CollectTransaction | string
      ): Promise<CollectRecordsArrayInstance<Schema>> => {
        let response

        if (labelOrData instanceof CollectBatchDraft) {
          response = await this.api?.records.createMany<Schema>(
            labelOrData,
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
          response = await this.api?.records.createMany<Schema>(data, transaction)
        }

        if (response?.success && response?.data) {
          const result = new CollectRecordsArrayInstance<Schema>(response.data, response.total)
          result.init(this)
          return result
        }

        return new CollectRecordsArrayInstance<Schema>([])
      },

      delete: async <Schema extends CollectSchema = any>(
        searchParams: CollectQuery<Schema>,
        transaction?: CollectTransaction | string
      ) => {
        if (isEmptyObject(searchParams.where)) {
          throw new EmptyTargetError(
            `You must specify criteria to delete records. Empty criteria are not allowed. If this was intentional, use the Dashboard instead.`
          )
        }

        return this.api?.records.delete(searchParams, transaction)
      },

      deleteById: async (
        idOrIds: MaybeArray<string>,
        transaction?: CollectTransaction | string
      ) => {
        return this.api?.records.deleteById(idOrIds, transaction)
      },

      detach: async (
        relationConfig: {
          source: string
          target: CollectRelationTarget
          options?: CollectRelationDetachOptions
        },
        transaction?: CollectTransaction | string
      ) => {
        // target is MaybeArray<CollectRecordInstance>
        if (relationConfig.target instanceof CollectRecordInstance) {
          const id = relationConfig.target.data?.__id
          if (id) {
            return await this.api.records.detach(
              {
                source: relationConfig.source,
                idOrIds: id,
                options: relationConfig.options
              },
              transaction
            )
          } else {
            throw new EmptyTargetError('Detach error: Target id is empty')
          }
        } else if (
          isArray(relationConfig.target) &&
          relationConfig.target.every((r) => r instanceof CollectRecordInstance)
        ) {
          const ids = relationConfig.target
            .map((r) => (r as CollectRecordInstance).data?.__id)
            .filter(Boolean)
          if (ids.length) {
            return await this.api.records.detach(
              {
                source: relationConfig.source,
                idOrIds: ids as string[],
                options: relationConfig.options
              },
              transaction
            )
          } else {
            throw new EmptyTargetError('Detach error: Target ids are empty')
          }
        }

        // target is CollectRecordsArrayInstance
        else if (relationConfig.target instanceof CollectRecordsArrayInstance) {
          const ids = relationConfig.target.data?.map((r) => r.__id).filter(Boolean)
          if (ids?.length) {
            return await this.api.records.detach(
              {
                source: relationConfig.source,
                idOrIds: ids,
                options: relationConfig.options
              },
              transaction
            )
          } else {
            throw new EmptyTargetError('Detach error: Target ids are empty')
          }
        }

        // target is MaybeArray<CollectRecord>
        else if (isObject(relationConfig.target) && '__id' in relationConfig.target) {
          return await this.api.records.detach(
            {
              source: relationConfig.source,
              idOrIds: relationConfig.target.__id,
              options: relationConfig.options
            },
            transaction
          )
        } else if (
          isArray(relationConfig.target) &&
          relationConfig.target.every((r) => isObject(r) && '__id' in r)
        ) {
          const ids = relationConfig.target?.map((r) => (r as CollectRecord).__id).filter(Boolean)
          if (ids?.length) {
            return await this.api.records.detach(
              {
                source: relationConfig.source,
                idOrIds: ids,
                options: relationConfig.options
              },
              transaction
            )
          } else {
            throw new EmptyTargetError('Detach error: Target ids are empty')
          }
        }

        // target is MaybeArray<string>
        else {
          return await this.api.records.detach(
            {
              source: relationConfig.source,
              idOrIds: relationConfig.target as MaybeArray<string>,
              options: relationConfig.options
            },
            transaction
          )
        }
      },

      export: async <Schema extends CollectSchema = any>(
        searchParams: CollectQuery<Schema>,
        transaction?: CollectTransaction | string
      ) => {
        return this.api?.records.export(searchParams, transaction)
      },

      find: async <Schema extends CollectSchema = any>(
        labelOrSearchParams?: CollectQuery<Schema> | string,
        searchParamsOrTransaction?: CollectQuery<Schema> | CollectTransaction | string,
        transaction?: CollectTransaction | string
      ): Promise<CollectRecordsArrayInstance<Schema>> => {
        const isTransactionParam = isTransaction(searchParamsOrTransaction)
        const { id, searchParams } = createSearchParams<Schema>(
          labelOrSearchParams,
          searchParamsOrTransaction
        )
        const tx = isTransactionParam ? searchParamsOrTransaction : transaction
        const response = await this.api?.records.find<Schema>({ id, searchParams }, tx)

        const result = new CollectRecordsArrayInstance<Schema>(
          response.data,
          response.total,
          searchParamsOrTransaction as CollectQuery<Schema>
        )
        result.init(this)
        return result
      },

      findById: async <
        Schema extends CollectSchema = CollectSchema,
        Arg extends MaybeArray<string> = MaybeArray<string>,
        Result = Arg extends string[] ? CollectRecordsArrayInstance<Schema>
        : CollectRecordInstance<Schema>
      >(
        idOrIds: Arg,
        transaction?: CollectTransaction | string
      ): Promise<Result> => {
        if (isArray(idOrIds)) {
          const response = (await this.api?.records.findById<Schema>(
            idOrIds,
            transaction
          )) as CollectApiResponse<CollectRecord<Schema>[]>
          const result = new CollectRecordsArrayInstance<Schema>(response.data, response.total)
          result.init(this)
          return result as Result
        } else {
          const response = (await this.api?.records.findById<Schema>(
            idOrIds,
            transaction
          )) as CollectApiResponse<CollectRecord<Schema>>
          const result = new CollectRecordInstance<Schema>(response.data)
          result.init(this)
          return result as Result
        }
      },

      findOne: async <Schema extends CollectSchema = any>(
        labelOrSearchParams?: CollectQuery<Schema> | string,
        searchParamsOrTransaction?: CollectQuery<Schema> | CollectTransaction | string,
        transaction?: CollectTransaction | string
      ): Promise<CollectRecordInstance<Schema>> => {
        const isTransactionParam = isTransaction(searchParamsOrTransaction)
        const { searchParams } = createSearchParams<Schema>(
          labelOrSearchParams,
          searchParamsOrTransaction
        )
        const tx = isTransactionParam ? searchParamsOrTransaction : transaction
        const response = await this.api?.records.findOne<Schema>(searchParams, tx)

        const result = new CollectRecordInstance<Schema>(
          response.data,
          searchParamsOrTransaction as CollectQuery<Schema>
        )
        result.init(this)
        return result
      },

      findUniq: async <Schema extends CollectSchema = any>(
        labelOrSearchParams?: CollectQuery<Schema> | string,
        searchParamsOrTransaction?: CollectQuery<Schema> | CollectTransaction | string,
        transaction?: CollectTransaction | string
      ): Promise<CollectRecordInstance<Schema>> => {
        const isTransactionParam = isTransaction(searchParamsOrTransaction)
        const { searchParams } = createSearchParams<Schema>(
          labelOrSearchParams,
          searchParamsOrTransaction
        )
        const tx = isTransactionParam ? searchParamsOrTransaction : transaction
        const response = await this.api?.records.findUniq<Schema>(searchParams, tx)

        const result = new CollectRecordInstance<Schema>(
          response.data,
          searchParamsOrTransaction as CollectQuery<Schema>
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

      set: async <Schema extends CollectSchema = any>(
        id: string,
        data: CollectRecordDraft | InferSchemaTypesWrite<Schema>,
        transaction?: CollectTransaction | string
      ) => {
        let response

        if (data instanceof CollectRecordDraft) {
          response = await this.api?.records.set<Schema>(id, data, transaction)
        } else if (isObjectFlat(data)) {
          const properties = prepareProperties(data)

          response = await this.api?.records.set<Schema>(
            id,
            new CollectRecordDraft({ properties } as {
              label: string
              properties: CollectPropertyWithValue[]
            }),
            transaction
          )
        } else if (isObject(data)) {
          throw Error('Provided data is not a flat object. Consider to use `createMany` method.')
        }

        if (response?.success && response?.data) {
          const result = new CollectRecordInstance<Schema>(response.data)
          result.init(this)
          return result
        }

        return new CollectRecordInstance<Schema>()
      },

      update: async <Schema extends CollectSchema = any>(
        id: string,
        data: CollectRecordDraft | Partial<InferSchemaTypesWrite<Schema>>,
        transaction?: CollectTransaction | string
      ) => {
        let response

        if (data instanceof CollectRecordDraft) {
          response = await this.api?.records.update<Schema>(id, data, transaction)
        } else if (isObjectFlat(data)) {
          const properties = prepareProperties(data)

          const recordDraft = new CollectRecordDraft({ properties } as {
            label: string
            properties: CollectPropertyWithValue[]
          })

          response = await this.api?.records.update<Schema>(id, recordDraft, transaction)
        } else if (isObject(data)) {
          throw Error('Provided data is not a flat object. Consider to use `createMany` method.')
        }

        if (response?.success && response?.data) {
          const result = new CollectRecordInstance<Schema>(response.data)
          result.init(this)
          return result
        }

        return new CollectRecordInstance<Schema>()
      }
    }
  }

  public relations = {
    find: async <Schema extends CollectSchema = any>({
      pagination,
      search,
      transaction
    }: {
      pagination?: Pick<CollectQuery, 'limit' | 'skip'>
      search?: CollectQuery<Schema>
      transaction?: CollectTransaction | string
    }) => {
      const { searchParams } = createSearchParams<Schema>(search)

      const tx = pickTransaction(transaction)

      return await this.api.relations.find(searchParams, pagination, tx)
    }
  }

  public properties = {
    delete: async (id: string, transaction?: CollectTransaction | string) => {
      return this.api?.properties.delete(id, transaction)
    },
    find: async <Schema extends CollectSchema = any>(
      searchParams: CollectQuery<Schema>,
      transaction?: CollectTransaction | string
    ) => {
      return this.api?.properties.find<Schema>(searchParams, transaction)
    },
    findById: async (id: string, transaction?: CollectTransaction | string) => {
      return this.api?.properties.findById(id, transaction)
    },
    values: async (id: string, transaction?: CollectTransaction | string) => {
      return this.api?.properties.values(id, transaction)
    }
  }

  public labels = {
    find: async <Schema extends CollectSchema = any>(
      searchParams: CollectQuery<Schema>,
      transaction?: CollectTransaction | string
    ) => {
      return this.api.labels.find<Schema>(searchParams, transaction)
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
