import type {
  CollectApiResponse,
  CollectObject,
  CollectProperty,
  CollectPropertyValue,
  CollectQuery,
  CollectRecord,
  CollectRecordsRelationsResponse,
  CollectSchema,
  Enumerable
} from '@collect.so/types'

import type { HttpClient } from '../network/HttpClient'
import type { UserProvidedConfig } from '../sdk/types'

import { createFetcher } from '../network'
import { CollectRecordResult, CollectRecordsArrayResult } from '../sdk/result'
import { CollectTransaction } from '../sdk/transaction'
import { CollectImportRecordsObject, CollectRecordObject } from '../sdk/utils'
import { normalizeRecord } from '../utils/normalize'
import { buildUrl, isArray, isObject, isObjectFlat, isString } from '../utils/utils'
import { createApi } from './create-api'
import { createSearchParams, isTransaction, pickTransaction } from './utils'

export class CollectRestAPI {
  public api: ReturnType<typeof createApi>
  public fetcher: ReturnType<typeof createFetcher>

  public records: {
    attach(
      sourceId: string,
      idOrIds: Enumerable<string>,
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<{ message: string }>>

    create<T extends CollectObject | CollectSchema = any>(
      data: CollectRecordObject | T,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordResult<T>>

    create<T extends CollectObject | CollectSchema = any>(
      label: string,
      data?: T,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordResult<T>>
    create<T extends CollectObject | CollectSchema = any>(
      labelOrData: CollectRecordObject | T | string,
      maybeDataOrTransaction?: CollectTransaction | T | string,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordResult<T>>
    createMany<T extends CollectObject | CollectSchema = any>(
      data: CollectImportRecordsObject | T[],
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordsArrayResult<T>>

    createMany<T extends CollectObject | CollectSchema = any>(
      label: string,
      data?: CollectImportRecordsObject | T[],
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordsArrayResult<T>>
    createMany<T extends CollectObject | CollectSchema = any>(
      labelOrData: CollectImportRecordsObject | Enumerable<T> | string,
      maybeDataOrTransaction?: CollectTransaction | Enumerable<T> | string,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordsArrayResult<T>>
    delete<T extends CollectObject | CollectSchema = any>(
      searchParams: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<{ message: string }>>

    deleteById(
      ids: Enumerable<string>,
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<{ message: string }>>

    detach(
      sourceId: string,
      idOrIds: Enumerable<string>,
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<{ message: string }>>

    export<T extends CollectObject | CollectSchema = any>(
      searchParams?: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<{ dateTime: string; fileContent: string }>>

    find<T extends CollectObject | CollectSchema = any>(
      label: string,
      searchParams?: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordsArrayResult<T>>
    find<T extends CollectObject | CollectSchema = any>(
      labelOrSearchParams: CollectQuery<T> | string,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordsArrayResult<T>>
    find<T extends CollectObject | CollectSchema = any>(
      searchParams: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordsArrayResult<T>>

    findById<T extends CollectObject | CollectSchema = any>(
      id: string,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordResult<T>>
    findById<T extends CollectObject | CollectSchema = any>(
      ids: string[],
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordsArrayResult<T>>

    findOne<T extends CollectObject | CollectSchema = any>(
      label: string,
      searchParams: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordResult<T>>
    findOne<T extends CollectObject | CollectSchema = any>(
      labelOrSearchParams: CollectQuery<T> | string,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordResult<T>>
    findOne<T extends CollectObject | CollectSchema = any>(
      searchParams: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordResult<T>>

    properties(
      id: string,
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<CollectProperty[]>>

    relations(
      id: string,
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<CollectRecordsRelationsResponse>>

    update<T extends CollectObject | CollectSchema = any>(
      id: string,
      data: CollectRecordObject | T,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordResult<T>>
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
        idOrIds: Enumerable<string>,
        transaction?: CollectTransaction | string
      ) => {
        return await this.api.records.attach(sourceId, idOrIds, transaction)
      },

      create: async <T extends CollectObject | CollectSchema = any>(
        labelOrData: CollectRecordObject | T | string,
        maybeDataOrTransaction?: CollectTransaction | T | string,
        transaction?: CollectTransaction | string
      ): Promise<CollectRecordResult<T>> => {
        let response

        if (labelOrData instanceof CollectRecordObject) {
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
            new CollectRecordObject(normalizedRecord),
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
              new CollectRecordObject(normalizedRecord),
              transaction
            )
          } else if (isObject(maybeDataOrTransaction)) {
            throw Error('Provided data is not a flat object. Consider to use `createMany` method.')
          }
        }

        if (response?.success && response?.data) {
          const result = new CollectRecordResult<T>(response.data)
          result.init(this)
          return result
        }

        return new CollectRecordResult<T>({} as CollectRecord<T>)
      },

      createMany: async <T extends CollectObject | CollectSchema = any>(
        labelOrData: CollectImportRecordsObject | Enumerable<T> | string,
        maybeDataOrTransaction?: CollectTransaction | Enumerable<T> | string,
        transaction?: CollectTransaction | string
      ): Promise<CollectRecordsArrayResult<T>> => {
        let response

        if (labelOrData instanceof CollectImportRecordsObject) {
          response = await this.api?.records.createMany<T>(
            labelOrData,
            pickTransaction(maybeDataOrTransaction)
          )
        }

        if (!response && (isArray(labelOrData) || isObject(labelOrData))) {
          const data = new CollectImportRecordsObject({
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
          const data = new CollectImportRecordsObject({
            label: labelOrData,
            payload: maybeDataOrTransaction
          })
          response = await this.api?.records.createMany<T>(data, transaction)
        }

        if (response?.success && response?.data) {
          const result = new CollectRecordsArrayResult<T>(response.data, response.total)
          result.init(this)
          return result
        }

        return new CollectRecordsArrayResult<T>([])
      },

      delete: async <T extends CollectObject | CollectSchema = any>(
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
        idOrIds: Enumerable<string>,
        transaction?: CollectTransaction | string
      ) => {
        return await this.api.records.detach(sourceId, idOrIds, transaction)
      },

      export: async <T extends CollectObject | CollectSchema = any>(
        searchParams: CollectQuery<T>,
        transaction?: CollectTransaction | string
      ) => {
        return this.api?.records.export(searchParams, transaction)
      },

      find: async <T extends CollectObject | CollectSchema = any>(
        labelOrSearchParams?: CollectQuery<T> | string,
        searchParamsOrTransaction?: CollectQuery<T> | CollectTransaction | string,
        transaction?: CollectTransaction | string
      ): Promise<CollectRecordsArrayResult<T>> => {
        const isTransactionParam = isTransaction(searchParamsOrTransaction)
        const { id, searchParams } = createSearchParams<T>(
          labelOrSearchParams,
          searchParamsOrTransaction
        )
        const tx = isTransactionParam ? searchParamsOrTransaction : transaction
        const response = await this.api?.records.find<T>({ id, searchParams }, tx)

        const result = new CollectRecordsArrayResult<T>(
          response.data,
          response.total,
          searchParamsOrTransaction as CollectQuery<T>
        )
        result.init(this)
        return result
      },

      findById: async <
        T extends CollectObject = CollectObject,
        Arg extends Enumerable<string> = Enumerable<string>,
        R = Arg extends string[] ? CollectRecordsArrayResult<T> : CollectRecordResult<T>
      >(
        idOrIds: Arg,
        transaction?: CollectTransaction | string
      ): Promise<R> => {
        if (isArray(idOrIds)) {
          const response = (await this.api?.records.findById<T>(
            idOrIds,
            transaction
          )) as CollectApiResponse<CollectRecord<T>[]>
          const result = new CollectRecordsArrayResult<T>(response.data, response.total)
          result.init(this)
          return result as R
        } else {
          const response = (await this.api?.records.findById<T>(
            idOrIds,
            transaction
          )) as CollectApiResponse<CollectRecord<T>>
          const result = new CollectRecordResult<T>(response.data)
          result.init(this)
          return result as R
        }
      },

      findOne: async <T extends CollectObject | CollectSchema = any>(
        labelOrSearchParams?: CollectQuery<T> | string,
        searchParamsOrTransaction?: CollectQuery<T> | CollectTransaction | string,
        transaction?: CollectTransaction | string
      ): Promise<CollectRecordResult<T>> => {
        const isTransactionParam = isTransaction(searchParamsOrTransaction)
        const { searchParams } = createSearchParams<T>(
          labelOrSearchParams,
          searchParamsOrTransaction
        )
        const tx = isTransactionParam ? searchParamsOrTransaction : transaction
        const response = await this.api?.records.findOne<T>(searchParams, tx)

        const result = new CollectRecordResult<T>(
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

      update: async <T extends CollectObject | CollectSchema = any>(
        id: string,
        data: CollectRecordObject | T,
        transaction?: CollectTransaction | string
      ) => {
        let response

        if (data instanceof CollectRecordObject) {
          response = await this.api?.records.update<T>(id, data, transaction)
        } else if (isObjectFlat(data)) {
          const normalizedRecord = normalizeRecord({
            payload: data as Record<string, CollectPropertyValue>
          })
          response = await this.api?.records.update<T>(
            id,
            new CollectRecordObject(normalizedRecord),
            transaction
          )
        } else if (isObject(data)) {
          throw Error('Provided data is not a flat object. Consider to use `createMany` method.')
        }

        if (response?.success && response?.data) {
          const result = new CollectRecordResult<T>(response.data)
          result.init(this)
          return result
        }

        return new CollectRecordResult<T>({} as CollectRecord<T>)
      }
    }
  }

  public properties = {
    delete: async (id: string, transaction?: CollectTransaction | string) => {
      return this.api?.properties.delete(id, transaction)
    },
    find: async <T extends CollectObject | CollectSchema = any>(
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
    find: async <T extends CollectObject | CollectSchema = any>(
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
