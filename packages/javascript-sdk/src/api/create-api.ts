import type { createFetcher } from '../network'
import type { CollectTransaction } from '../sdk/transaction'
import type {
  CollectApiResponse,
  CollectFile,
  CollectProperty,
  CollectPropertyValuesData,
  CollectQuery,
  CollectRecord,
  CollectSchema,
  Enumerable
} from '../types'

import { CollectBatchDraft, CollectRecordDraft } from '../sdk/utils'
import { isArray } from '../utils/utils'
import { buildTransactionHeader, pickTransactionId } from './utils'

// @TODO's
// PATCH /api/v1/records/:id @TODO
// POST /api/v1/records/:id @TODO

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
    update() {
      // @TODO
    },
    upload() {
      // @TODO
    }
  },
  labels: {
    async find<T extends CollectSchema = any>(
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
    delete: (id: string, transaction?: CollectTransaction | string) => {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<CollectProperty>>(`/properties/${id}`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'DELETE'
      })
    },
    find: <T extends CollectSchema = any>(
      searchParams: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ) => {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<CollectProperty[]>>(`/properties`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'POST',
        requestData: searchParams
      })
    },
    findById: (id: string, transaction?: CollectTransaction | string) => {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<CollectProperty>>(`/properties/${id}`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'GET'
      })
    },
    update: () => {
      // @TODO
    },
    updateValues: (id: string, transaction?: CollectTransaction | string) => {
      // @TODO
    },
    values: (id: string, transaction?: CollectTransaction | string) => {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<CollectProperty & CollectPropertyValuesData>>(
        `/properties/${id}/values`,
        {
          headers: Object.assign({}, buildTransactionHeader(txId)),
          method: 'GET'
        }
      )
    }
  },
  records: {
    attach: async (
      id: string,
      idOrIds: Enumerable<string>,
      transaction?: CollectTransaction | string
    ) => {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<{ message: string }>>(`/records/${id}/relations`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'POST',
        requestData: { targetIds: idOrIds }
      })
    },
    async create<T extends CollectSchema = any>(
      data: CollectRecordDraft | T,
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<CollectRecord<T> | undefined>> {
      const txId = pickTransactionId(transaction)

      if (data instanceof CollectRecordDraft) {
        return fetcher<CollectApiResponse<CollectRecord<T>>>(`/records`, {
          headers: Object.assign({}, buildTransactionHeader(txId)),
          method: 'POST',
          requestData: data.toJson()
        })
      }

      return { data: undefined, success: false }
    },

    async createMany<T extends CollectSchema = any>(
      data: CollectBatchDraft | T[],
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<CollectRecord<T>[]>> {
      const txId = pickTransactionId(transaction)

      if (data instanceof CollectBatchDraft) {
        return fetcher<CollectApiResponse<CollectRecord<T>[]>>(`/records/import/json`, {
          headers: Object.assign({}, buildTransactionHeader(txId)),
          method: 'POST',
          requestData: data.toJson()
        })
      }

      return { data: [], success: false }
    },

    delete<T extends CollectSchema = any>(
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

    detach: async (
      id: string,
      idOrIds: Enumerable<string>,
      transaction?: CollectTransaction | string
    ) => {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<{ message: string }>>(`/records/${id}/relations`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'DELETE',
        requestData: { targetIds: idOrIds }
      })
    },

    export<T extends CollectSchema = any>(
      searchParams: CollectQuery<T>,
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<{ dateTime: string; fileContent: string }>>(
        `/records/export/csv`,
        {
          headers: Object.assign({}, buildTransactionHeader(txId)),
          method: 'POST',
          requestData: searchParams
        }
      )
    },

    find<T extends CollectSchema = any>(
      params?: { id?: string; searchParams: CollectQuery<T> },
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)
      const url = params?.id ? `/records/${params?.id}/search` : `/records/search`

      return fetcher<CollectApiResponse<CollectRecord<T>[]>>(url, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'POST',
        requestData: params?.searchParams
      })
    },

    findById<T extends CollectSchema = any>(
      ids: Enumerable<string>,
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)
      if (isArray(ids)) {
        return fetcher<CollectApiResponse<CollectRecord<T>[]>>(`/records`, {
          headers: Object.assign({}, buildTransactionHeader(txId)),
          method: 'POST',
          requestData: { ids }
        })
      }
      return fetcher<CollectApiResponse<CollectRecord<T>>>(`/records/${ids}`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'GET'
      })
    },

    async findOne<T extends CollectSchema = any>(
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

    properties(id: string, transaction?: CollectTransaction | string) {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<CollectProperty[]>>(`/records/${id}/properties`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'GET'
      })
    },

    relations: async (id: string, transaction?: CollectTransaction | string) => {
      const txId = pickTransactionId(transaction)

      return fetcher<
        CollectApiResponse<
          Array<{
            relations: Array<{ count: number; label: string }>
            type: string
          }>
        >
      >(`/records/${id}/relations`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'GET'
      })
    },

    update<T extends CollectSchema = any>(
      id: string,
      data: CollectRecordDraft | T,
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
