import type { createFetcher } from '../network/index.js'
import type {
  CollectRecord,
  CollectRelationDetachOptions,
  CollectRelationOptions
} from '../sdk/record.js'
import type { CollectTransaction } from '../sdk/transaction.js'
import type {
  CollectProperty,
  CollectPropertyValuesData,
  CollectQuery,
  CollectSchema,
  MaybeArray
} from '../types/index.js'
import type { CollectApiResponse } from './types.js'

import { isArray } from '../common/utils.js'
import { CollectBatchDraft, CollectRecordDraft } from '../sdk/record.js'
import { buildTransactionHeader, pickTransactionId } from './utils.js'

// @TODO's
// PATCH /api/v1/records/:id @TODO
// POST /api/v1/records/:id @TODO

export const createApi = (fetcher: ReturnType<typeof createFetcher>) => ({
  labels: {
    async find<Schema extends CollectSchema = any>(
      searchParams: CollectQuery<Schema>,
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
    find: <Schema extends CollectSchema = any>(
      searchParams: CollectQuery<Schema>,
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
      idOrIds: MaybeArray<string>,
      options?: CollectRelationOptions,
      transaction?: CollectTransaction | string
    ) => {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<{ message: string }>>(`/records/${id}/relations`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'POST',
        requestData: {
          targetIds: idOrIds,
          ...(options?.type && { type: options?.type }),
          ...(options?.direction && { direction: options?.direction })
        }
      })
    },
    async create<Schema extends CollectSchema = any>(
      data: CollectRecordDraft | Schema,
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<CollectRecord<Schema> | undefined>> {
      const txId = pickTransactionId(transaction)

      if (data instanceof CollectRecordDraft) {
        return fetcher<CollectApiResponse<CollectRecord<Schema>>>(`/records`, {
          headers: Object.assign({}, buildTransactionHeader(txId)),
          method: 'POST',
          requestData: data.toJson()
        })
      }

      return { data: undefined, success: false }
    },

    async createMany<Schema extends CollectSchema = any>(
      data: CollectBatchDraft | Schema[],
      transaction?: CollectTransaction | string
    ): Promise<CollectApiResponse<CollectRecord<Schema>[]>> {
      const txId = pickTransactionId(transaction)

      if (data instanceof CollectBatchDraft) {
        return fetcher<CollectApiResponse<CollectRecord<Schema>[]>>(`/records/import/json`, {
          headers: Object.assign({}, buildTransactionHeader(txId)),
          method: 'POST',
          requestData: data.toJson()
        })
      }

      return { data: [], success: false }
    },

    delete<Schema extends CollectSchema = any>(
      searchParams: CollectQuery<Schema>,
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<{ message: string }>>(`/records/delete`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'PUT',
        requestData: searchParams
      })
    },

    deleteById(ids: MaybeArray<string>, transaction?: CollectTransaction | string) {
      const txId = pickTransactionId(transaction)

      if (isArray(ids)) {
        return fetcher<CollectApiResponse<{ message: string }>>(`/records/delete`, {
          headers: Object.assign({}, buildTransactionHeader(txId)),
          method: 'PUT',
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
      idOrIds: MaybeArray<string>,
      options?: CollectRelationDetachOptions,
      transaction?: CollectTransaction | string
    ) => {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<{ message: string }>>(`/records/${id}/relations`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'PUT',
        requestData: {
          targetIds: idOrIds,
          ...(options?.typeOrTypes && { typeOrTypes: options?.typeOrTypes }),
          ...(options?.direction && { direction: options?.direction })
        }
      })
    },

    export<Schema extends CollectSchema = any>(
      searchParams: CollectQuery<Schema>,
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

    find<Schema extends CollectSchema = any>(
      params?: { id?: string; searchParams: CollectQuery<Schema> },
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)
      const url = params?.id ? `/records/${params?.id}/search` : `/records/search`

      return fetcher<CollectApiResponse<CollectRecord<Schema>[]>>(url, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'POST',
        requestData: params?.searchParams
      })
    },

    findById<Schema extends CollectSchema = any>(
      ids: MaybeArray<string>,
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)
      if (isArray(ids)) {
        return fetcher<CollectApiResponse<CollectRecord<Schema>[]>>(`/records`, {
          headers: Object.assign({}, buildTransactionHeader(txId)),
          method: 'POST',
          requestData: { ids }
        })
      }
      return fetcher<CollectApiResponse<CollectRecord<Schema>>>(`/records/${ids}`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'GET'
      })
    },

    async findOne<Schema extends CollectSchema = any>(
      searchParams: CollectQuery<Schema>,
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)

      // @TODO: create distinct API method to fetch single record by search params
      const response = await fetcher<CollectApiResponse<CollectRecord<Schema>[]>>(
        `/records/search`,
        {
          headers: Object.assign({}, buildTransactionHeader(txId)),
          method: 'POST',
          requestData: { ...searchParams, limit: 1, skip: 0 } as CollectQuery<Schema>
        }
      )
      const [record] = response.data
      return { ...response, data: record } as CollectApiResponse<CollectRecord<Schema>>
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

    update<Schema extends CollectSchema = any>(
      id: string,
      data: CollectRecordDraft | Schema,
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)

      return fetcher<CollectApiResponse<CollectRecord<Schema>>>(`/records/${id}`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'PUT',
        requestData: data instanceof CollectRecordDraft ? data.toJson() : data
      })
    }
    // upsert() {
    //   // @TODO
    // }

    // patch() {
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
