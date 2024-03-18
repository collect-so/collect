import type {
  CollectApiResponse,
  CollectFile,
  CollectObject,
  CollectProperty,
  CollectQuery,
  CollectRecord,
  CollectRecordsRelationsRequest,
  CollectRecordsRelationsResponse,
  Enumerable
} from '@collect.so/types'

import type { createFetcher } from '../network'
import type { CollectTransaction } from '../sdk/transaction'

import { CollectImportRecordsObject, CollectRecordObject } from '../sdk/utils'
import { isArray, isObject, isString } from '../utils/utils'
import { buildTransactionHeader, pickTransactionId } from './utils'

// @TODO's
// POST API.attach @TODO
// POST API.detach @TODO
// POST API.upsert @TODO
// PATCH /api/v1/records/:id @TODO
// POST API.labels @TODO
// GET API.values/:propertyId

// POST /api/v1/records/:id @TODO
// PUT /api/v1/records/:id
// DELETE /api/v1/records
// DELETE /api/v1/records/:id
// POST /api/v1/records/properties /api/v1/records/:id/properties

export const createApi = (fetcher: ReturnType<typeof createFetcher>) => ({
  files: {
    delete() {
      // @TODO
    },
    get() {
      // @TODO
    },
    list(transaction?: CollectTransaction | string) {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<CollectFile[]>>(`/files`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'GET'
      })
    },
    update<T extends CollectObject>(
      id: string,
      data: T,
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<T>>(`/records/${id}`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'PATCH',
        requestData: JSON.stringify(data)
      })
    },
    upload() {
      // @TODO
    }
  },
  labels: {
    async find<T extends CollectObject = CollectObject>(
      searchParams: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<Record<string, number>>>(`/labels`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'POST',
        requestData: searchParams
      })
    }
  },
  properties: {
    delete: () => {
      // @TODO
    },
    find: <T extends CollectObject = CollectObject>(
      searchParams: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ) => {
      // @TODO
    },
    findById: (id: string, transaction?: CollectTransaction | string) => {
      // @TODO
    },
    update: () => {
      // @TODO
    },
    updateValues: (id: string, transaction?: CollectTransaction | string) => {
      // @TODO
    },
    values: (id: string, transaction?: CollectTransaction | string) => {
      // @TODO
    }
  },
  records: {
    async create<T extends CollectObject = CollectObject>(
      data: CollectRecordObject | T,
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<CollectRecord<T> | undefined>> {
      const txId = pickTransactionId(transaction)

      if (data instanceof CollectRecordObject) {
        return fetcher<CollectApiResponse<CollectRecord<T>>>(`/records`, {
          headers: Object.assign({}, buildTransactionHeader(txId)),
          method: 'POST',
          requestData: data.toJson()
        })
      }

      return { data: undefined, success: false }
    },

    async createMany<T extends CollectObject = CollectObject>(
      data: CollectImportRecordsObject | T[],
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<CollectRecord<T>[]>> {
      const txId = pickTransactionId(transaction)

      if (data instanceof CollectImportRecordsObject) {
        return fetcher<CollectApiResponse<CollectRecord<T>[]>>(`/import/json`, {
          headers: Object.assign({}, buildTransactionHeader(txId)),
          method: 'POST',
          requestData: data.toJson()
        })
      }

      return { data: [], success: false }
    },

    delete<T extends CollectObject = CollectObject>(
      searchParams: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<{ message: string }>>(`/records`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'DELETE',
        requestData: searchParams
      })
    },

    deleteById(ids: Enumerable<string>, transaction?: CollectTransaction | string) {
      const txId = pickTransactionId(transaction)

      if (isArray(ids)) {
        return fetcher<CollectApiResponse<{ message: string }>>(`/records`, {
          headers: Object.assign({}, buildTransactionHeader(txId)),
          method: 'DELETE',
          requestData: { ids: ids }
        })
      } else {
        return fetcher<CollectApiResponse<{ message: string }>>(`/records/${ids}`, {
          headers: Object.assign({}, buildTransactionHeader(txId)),
          method: 'DELETE'
        })
      }
    },

    export<T extends CollectObject = CollectObject>(
      searchParams: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<string>>(`/records/export/csv`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'POST',
        requestData: searchParams
      })
    },

    find<T extends CollectObject = CollectObject>(
      searchParams: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<CollectRecord<T>[]>>(`/records/search`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'POST',
        requestData: searchParams
      })
    },

    findById<T extends CollectObject = CollectObject>(
      id: string,
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<CollectRecord<T>>>(`/records/${id}`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'GET'
      })
    },

    async findOne<T extends CollectObject = CollectObject>(
      searchParams: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)

      // @TODO: create distinct API method to fetch single record by search params
      const response = await fetcher<CollectApiResponse<CollectRecord<T>[]>>(`/records/search`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'POST',
        requestData: { ...searchParams, limit: 1, skip: 0 } as CollectQuery<T>
      })
      const [record] = response.data
      return { ...response, data: record } as CollectApiResponse<CollectRecord<T>>
    },

    properties<T extends CollectObject = CollectObject>(
      idOrSearchParams: CollectQuery<T> | string,
      searchParams: CollectQuery<T> = {},
      transaction?: CollectTransaction | string
    ) {
      const url =
        isString(idOrSearchParams) ?
          `/api/v1/records/${idOrSearchParams}/properties`
        : `/api/v1/records/properties`

      const txId = pickTransactionId(transaction)
      const requestData = isObject(idOrSearchParams) ? idOrSearchParams : searchParams

      return fetcher<CollectApiResponse<CollectProperty[]>>(url, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'POST',
        requestData
      })
    },

    relations: async (
      id: string,
      searchParams: CollectRecordsRelationsRequest = {},
      transaction?: CollectTransaction | string
    ) => {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<CollectRecordsRelationsResponse>>(
        `/records/${id}/relations`,
        {
          headers: Object.assign({}, buildTransactionHeader(txId)),
          method: 'POST',
          requestData: searchParams
        }
      )
    },

    update<T extends CollectObject = CollectObject>(
      id: string,
      data: CollectRecordObject | T,
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<CollectRecord<T>>>(`/records/${id}`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'PUT',
        requestData: data
      })
    }
    // upsert() {
    //   // @TODO
    // }
  },
  tx: {
    begin(config: Partial<{ ttl: number }> = {}) {
      return fetcher<CollectApiResponse<{ id: string }>>(`/tx`, {
        method: 'POST',
        requestData: config
      })
    },
    commit(id: string) {
      return fetcher<CollectApiResponse<{ message: string }>>(`/tx/${id}/commit`, {
        method: 'POST',
        requestData: {}
      })
    },
    get(id: string) {
      return fetcher<CollectApiResponse<{ id: string }>>(`/tx/${id}`, {
        method: 'GET'
      })
    },
    rollback(id: string) {
      return fetcher<CollectApiResponse<{ message: string }>>(`/tx/${id}/rollback`, {
        method: 'POST',
        requestData: {}
      })
    }
  }
})
