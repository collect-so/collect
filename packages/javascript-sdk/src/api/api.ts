import type {
  CollectApiResponse,
  CollectObject,
  CollectProperty,
  CollectPropertyValue,
  CollectQuery,
  CollectRecord,
  CollectRecordsRelationsRequest,
  CollectRecordsRelationsResponse,
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
import { isTransaction, pickTransaction } from './utils'

export class CollectRestAPI {
  public api: ReturnType<typeof createApi>
  public fetcher: ReturnType<typeof createFetcher>

  public records: {
    create<T extends CollectObject = CollectObject>(
      data: CollectRecordObject | T,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordResult<T>>
    create<T extends CollectObject = CollectObject>(
      label: string,
      data?: T,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordResult<T>>
    create<T extends CollectObject = CollectObject>(
      labelOrData: CollectRecordObject | T | string,
      maybeDataOrTransaction?: CollectTransaction | T | string,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordResult<T>>

    createMany<T extends CollectObject = CollectObject>(
      data: CollectImportRecordsObject | T[],
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordsArrayResult<T>>
    createMany<T extends CollectObject = CollectObject>(
      label: string,
      data?: CollectImportRecordsObject | T[],
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordsArrayResult<T>>
    createMany<T extends CollectObject = CollectObject>(
      labelOrData: CollectImportRecordsObject | Enumerable<T> | string,
      maybeDataOrTransaction?: CollectTransaction | Enumerable<T> | string,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordsArrayResult<T>>

    delete<T extends CollectObject = CollectObject>(
      searchParams: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<{ message: string }>>

    deleteById(
      ids: Enumerable<string>,
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<{ message: string }>>

    export<T extends CollectObject = CollectObject>(
      searchParams?: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<string>>

    find<T extends CollectObject = CollectObject>(
      label?: string,
      searchParams?: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordsArrayResult<T>>
    find<T extends CollectObject = CollectObject>(
      labelOrSearchParams?: CollectQuery<T> | string,
      searchParamsOrTransaction?: CollectQuery<T> | CollectTransaction | string,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordsArrayResult<T>>
    find<T extends CollectObject = CollectObject>(
      searchParams?: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordsArrayResult<T>>

    findById<T extends CollectObject = CollectObject>(
      id: string,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordResult<T>>

    findOne<T extends CollectObject = CollectObject>(
      label?: string,
      searchParams?: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordResult<T>>
    findOne<T extends CollectObject = CollectObject>(
      labelOrSearchParams?: CollectQuery<T> | string,
      searchParamsOrTransaction?: CollectQuery<T> | CollectTransaction | string,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordResult<T>>
    findOne<T extends CollectObject = CollectObject>(
      searchParams?: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordResult<T>>

    properties<T extends CollectObject = CollectObject>(
      id: string,
      searchParamsOrTransaction?: CollectQuery<T> | CollectTransaction | string
    ): Promise<CollectApiResponse<CollectProperty[]>>
    properties<T extends CollectObject = CollectObject>(
      id: string,
      searchParamsOrTransaction?: CollectQuery<T> | CollectTransaction | string,
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<CollectProperty[]>>

    relations(
      id: string,
      searchParamsOrTransaction?: CollectRecordsRelationsRequest | CollectTransaction | string
    ): Promise<CollectApiResponse<CollectRecordsRelationsResponse>>
    relations(
      id: string,
      searchParamsOrTransaction?: CollectRecordsRelationsRequest | CollectTransaction | string,
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<CollectRecordsRelationsResponse>>

    update<T extends CollectObject = CollectObject>(
      id: string,
      data: CollectRecordObject | T,
      transaction?: CollectTransaction | string
    ): Promise<CollectRecordResult<T>>
  }

  constructor(token?: string, config?: UserProvidedConfig & { httpClient: HttpClient }) {
    this.fetcher = null as unknown as ReturnType<typeof createFetcher>

    if (token && config?.httpClient) {
      const url = buildUrl(config)
      this.fetcher = createFetcher({
        httpClient: config.httpClient,
        token,
        url
      })
    }
    this.api = createApi(this.fetcher)

    this.records = {
      create: async <T extends CollectObject = CollectObject>(
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

        if (isObjectFlat(labelOrData)) {
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

        if (isString(labelOrData)) {
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

      createMany: async <T extends CollectObject = CollectObject>(
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

        if (isArray(labelOrData) || isObject(labelOrData)) {
          const data = new CollectImportRecordsObject({
            payload: labelOrData
          })

          response = await this.api?.records.createMany<T>(
            data,
            pickTransaction(maybeDataOrTransaction)
          )
        }

        if (
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
          const result = new CollectRecordsArrayResult<T>(response.data)
          result.init(this)
          return result
        }

        return new CollectRecordsArrayResult<T>([])
      },

      delete: async <T extends CollectObject = CollectObject>(
        searchParams: CollectQuery<T>,
        transaction?: CollectTransaction | string
      ) => {
        return this.api?.records.delete(searchParams, transaction)
      },

      deleteById: async (ids: Enumerable<string>, transaction?: CollectTransaction | string) => {
        return this.api?.records.deleteById(ids, transaction)
      },

      export: async <T extends CollectObject = CollectObject>(
        searchParams: CollectQuery<T>,
        transaction?: CollectTransaction | string
      ) => {
        return this.api?.records.export(searchParams, transaction)
      },

      find: async <T extends CollectObject = CollectObject>(
        labelOrSearchParams?: CollectQuery<T> | string,
        searchParamsOrTransaction?: CollectQuery<T> | CollectTransaction | string,
        transaction?: CollectTransaction | string
      ): Promise<CollectRecordsArrayResult<T>> => {
        let response

        const secondArgumentIsTransaction = isTransaction(searchParamsOrTransaction)
        const firstArgumentIsLabel = isString(labelOrSearchParams)

        // Label provided
        if (firstArgumentIsLabel) {
          if (!secondArgumentIsTransaction) {
            // CollectQuery provided
            if (isObject(searchParamsOrTransaction)) {
              response = await this.api?.records.find<T>(
                {
                  ...searchParamsOrTransaction,
                  labels: [...(searchParamsOrTransaction?.labels ?? []), labelOrSearchParams]
                },
                transaction
              )
            }
            // CollectQuery not provided
            else {
              response = await this.api?.records.find<T>(
                {
                  labels: [labelOrSearchParams]
                },
                transaction
              )
            }
          } else {
            response = await this.api?.records.find<T>(
              {
                labels: [labelOrSearchParams]
              },
              searchParamsOrTransaction
            )
          }
        } else {
          const tx = secondArgumentIsTransaction ? searchParamsOrTransaction : undefined
          response = await this.api?.records.find<T>(labelOrSearchParams ?? {}, tx)
        }

        const result = new CollectRecordsArrayResult<T>(
          response.data,
          searchParamsOrTransaction as CollectQuery<T>
        )
        result.init(this)
        return result
      },

      findById: async <T extends CollectObject = CollectObject>(
        id: string,
        transaction?: CollectTransaction | string
      ): Promise<CollectRecordResult<T>> => {
        const response = await this.api?.records.findById<T>(id, transaction)

        const result = new CollectRecordResult<T>(response.data)
        result.init(this)
        return result
      },

      findOne: async <T extends CollectObject = CollectObject>(
        labelOrSearchParams?: CollectQuery<T> | string,
        searchParamsOrTransaction?: CollectQuery<T> | CollectTransaction | string,
        transaction?: CollectTransaction | string
      ): Promise<CollectRecordResult<T>> => {
        let response

        const secondArgumentIsTransaction = isTransaction(searchParamsOrTransaction)
        const firstArgumentIsLabel = isString(labelOrSearchParams)

        // Label provided
        if (firstArgumentIsLabel) {
          if (!secondArgumentIsTransaction) {
            // CollectQuery provided
            if (isObject(searchParamsOrTransaction)) {
              response = await this.api?.records.findOne<T>(
                {
                  ...searchParamsOrTransaction,
                  labels: [...(searchParamsOrTransaction?.labels ?? []), labelOrSearchParams]
                },
                transaction
              )
            }
            // CollectQuery not provided
            else {
              response = await this.api?.records.findOne<T>(
                {
                  labels: [labelOrSearchParams]
                },
                transaction
              )
            }
          } else {
            response = await this.api?.records.findOne<T>(
              {
                labels: [labelOrSearchParams]
              },
              searchParamsOrTransaction
            )
          }
        } else {
          const tx = secondArgumentIsTransaction ? searchParamsOrTransaction : undefined
          response = await this.api?.records.findOne<T>(labelOrSearchParams ?? {}, tx)
        }

        const result = new CollectRecordResult<T>(
          response.data,
          searchParamsOrTransaction as CollectQuery<T>
        )
        result.init(this)
        return result
      },

      properties: async <T extends CollectObject = CollectObject>(
        id: string,
        searchParamsOrTransaction: CollectQuery<T> | CollectTransaction | string,
        transaction?: CollectTransaction | string
      ) => {
        const maybeTransaction = pickTransaction(searchParamsOrTransaction)

        if (maybeTransaction) {
          return await this.api.records.properties(id, {}, maybeTransaction)
        }

        return await this.api.records.properties(
          id,
          isObject(searchParamsOrTransaction) ? (searchParamsOrTransaction as CollectQuery<T>) : {},
          transaction
        )
      },

      relations: async (
        id: string,
        searchParamsOrTransaction: CollectRecordsRelationsRequest | CollectTransaction | string,
        transaction?: CollectTransaction | string
      ) => {
        const maybeTransaction = pickTransaction(searchParamsOrTransaction)

        if (maybeTransaction) {
          return await this.api.records.relations(id, {}, maybeTransaction)
        }

        return await this.api.records.relations(
          id,
          isObject(searchParamsOrTransaction) ?
            (searchParamsOrTransaction as CollectRecordsRelationsRequest)
          : {},
          transaction
        )
      },

      update: async <T extends CollectObject = CollectObject>(
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

  tx = {
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
