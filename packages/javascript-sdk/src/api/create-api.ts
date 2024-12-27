import type { createFetcher } from '../network/index.js'
import type {
  CollectRecord,
  CollectRecordTarget,
  CollectRelation,
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
import { NonUniqueResultError } from '../sdk/errors.js'
import { CollectBatchDraft, CollectRecordDraft } from '../sdk/record.js'
import { buildTransactionHeader, pickRecordId, pickTransactionId } from './utils.js'

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
    // update: () => {
    //   // @TODO
    // },
    // updateValues: (id: string, transaction?: CollectTransaction | string) => {
    //   // @TODO
    // },
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
      source: CollectRecordTarget,
      idOrIds: MaybeArray<string>,
      options?: CollectRelationOptions,
      transaction?: CollectTransaction | string
    ) => {
      const txId = pickTransactionId(transaction)
      const recordId = pickRecordId(source)!

      return fetcher<CollectApiResponse<{ message: string }>>(`/records/${recordId}/relations`, {
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

    deleteById(idOrIds: MaybeArray<string>, transaction?: CollectTransaction | string) {
      const txId = pickTransactionId(transaction)

      if (isArray(idOrIds)) {
        return fetcher<CollectApiResponse<{ message: string }>>(`/records/delete`, {
          headers: Object.assign({}, buildTransactionHeader(txId)),
          method: 'PUT',
          requestData: { limit: 1000, where: { $id: { $in: idOrIds } } }
        })
      } else {
        return fetcher<CollectApiResponse<{ message: string }>>(`/records/${idOrIds}`, {
          headers: Object.assign({}, buildTransactionHeader(txId)),
          method: 'DELETE'
        })
      }
    },

    detach: async (
      source: CollectRecordTarget,
      idOrIds: MaybeArray<string>,
      options?: CollectRelationDetachOptions,
      transaction?: CollectTransaction | string
    ) => {
      const txId = pickTransactionId(transaction)
      const recordId = pickRecordId(source)!

      return fetcher<CollectApiResponse<{ message: string }>>(`/records/${recordId}/relations`, {
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
      idOrIds: MaybeArray<string>,
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)
      if (isArray(idOrIds)) {
        return fetcher<CollectApiResponse<CollectRecord<Schema>[]>>(`/records`, {
          headers: Object.assign({}, buildTransactionHeader(txId)),
          method: 'POST',
          requestData: { ids: idOrIds }
        })
      }
      return fetcher<CollectApiResponse<CollectRecord<Schema>>>(`/records/${idOrIds}`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'GET'
      })
    },

    async findOne<Schema extends CollectSchema = any>(
      searchParams: CollectQuery<Schema>,
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)

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

    async findUniq<Schema extends CollectSchema = any>(
      searchParams: CollectQuery<Schema>,
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)

      const response = await fetcher<CollectApiResponse<CollectRecord<Schema>[]>>(
        `/records/search`,
        {
          headers: Object.assign({}, buildTransactionHeader(txId)),
          method: 'POST',
          requestData: { ...searchParams, limit: 1, skip: 0 } as CollectQuery<Schema>
        }
      )

      if (typeof response.total !== 'undefined' && response.total > 1) {
        throw new NonUniqueResultError(response.total, searchParams)
      }

      const [record] = response.data
      return { ...response, data: record } as CollectApiResponse<CollectRecord<Schema>>
    },

    properties(target: string, transaction?: CollectTransaction | string) {
      const txId = pickTransactionId(transaction)
      const recordId = pickRecordId(target)!

      return fetcher<CollectApiResponse<CollectProperty[]>>(`/records/${recordId}/properties`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'GET'
      })
    },

    relations: async (target: CollectRecordTarget, transaction?: CollectTransaction | string) => {
      const txId = pickTransactionId(transaction)
      const recordId = pickRecordId(target)!

      return fetcher<CollectApiResponse<Array<CollectRelation>>>(`/records/${recordId}/relations`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'GET'
      })
    },
    // upsert() {
    //   // @TODO
    // }

    set<Schema extends CollectSchema = any>(
      target: CollectRecordTarget,
      data: CollectRecordDraft | Schema,
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)
      const recordId = pickRecordId(target)!

      return fetcher<CollectApiResponse<CollectRecord<Schema>>>(`/records/${recordId}`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'PUT',
        requestData: data instanceof CollectRecordDraft ? data.toJson() : data
      })
    },
    update<Schema extends CollectSchema = any>(
      target: CollectRecordTarget,
      data: CollectRecordDraft | Schema,
      transaction?: CollectTransaction | string
    ) {
      const txId = pickTransactionId(transaction)
      const recordId = pickRecordId(target)!

      return fetcher<CollectApiResponse<CollectRecord<Schema>>>(`/records/${recordId}`, {
        headers: Object.assign({}, buildTransactionHeader(txId)),
        method: 'PATCH',
        requestData: data instanceof CollectRecordDraft ? data.toJson() : data
      })
    }
  },
  relations: {
    find: async <Schema extends CollectSchema = any>(
      searchParams: CollectQuery<Schema>,
      pagination?: Pick<CollectQuery, 'limit' | 'skip'>,
      transaction?: CollectTransaction | string
    ) => {
      const txId = pickTransactionId(transaction)

      const queryParams = new URLSearchParams()

      if (typeof pagination?.limit !== 'undefined') {
        queryParams.append('limit', pagination.limit.toString())
      }
      if (typeof pagination?.skip !== 'undefined') {
        queryParams.append('skip', pagination?.skip.toString())
      }

      const queryString = queryParams.toString() ? '?' + queryParams.toString() : ''

      return fetcher<CollectApiResponse<Array<CollectRelation>>>(
        `/records/relations/search${queryString}`,
        {
          headers: Object.assign({}, buildTransactionHeader(txId)),
          method: 'POST',
          requestData: searchParams
        }
      )
    }
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
