import type {
  CollectApiResponse,
  CollectFile,
  CollectObject,
  CollectProperty,
  CollectQuery,
  Enumerable
} from '@collect.so/types'

import type { createFetcher } from '../network'

import { isArray, isObject } from '../utils/utils'
import { CollectImportRecordsObject, CollectRecordObject } from './utils'

// @TODO's
// POST API.attach @TODO
// POST API.detach @TODO
// POST API.upsert @TODO
// System
// POST API.beginTransaction
// POST API.commitTransaction
// POST API.rollbackTransaction

// Resources
// POST API.find({ searchparams })
// POST API.findById(id)
// POST API.findOne({ searchparams })

// POST API.create

// PATCH API.update

// DELETE API.delete([ids...] | { searchparams })
// DELETE API.deleteById(id)

// Metadata
// POST API.properties
// POST API.relations
// POST API.labels
// GET API.values/:propertyId

// POST /api/v1/import/json
// GET /api/v1/records/:id
// POST /api/v1/records/ /api/v1/records/:id
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
    list() {
      // @TODO
      return fetcher<CollectApiResponse<CollectFile[]>>(`/files`, {
        method: 'GET'
      })
    },
    update<T extends CollectObject>(id: string, data: T) {
      return fetcher<CollectApiResponse<T>>(`/records/${id}`, {
        method: 'PATCH',
        requestData: JSON.stringify(data)
      })
    },
    upload() {
      // @TODO
    }
  },
  labels: {},
  properties: {
    // @TODO
  },
  records: {
    attach() {
      // @TODO
    },
    async create<T extends CollectObject = CollectObject>(
      data: CollectRecordObject | T
    ): Promise<CollectApiResponse<T | undefined>> {
      if (data instanceof CollectRecordObject) {
        return fetcher<CollectApiResponse<T>>(`/records`, {
          method: 'POST',
          requestData: data.toJson()
        })
      }

      return { data: undefined, success: false }
    },
    async createMany<T extends CollectObject = CollectObject>(
      data: CollectImportRecordsObject | T[]
    ): Promise<CollectApiResponse<T[]>> {
      if (data instanceof CollectImportRecordsObject) {
        return fetcher<CollectApiResponse<T[]>>(`/import/json`, {
          method: 'POST',
          requestData: data.toJson()
        })
      }

      return { data: [], success: false }
    },
    delete<T extends CollectObject = CollectObject>(
      searchParams: CollectQuery<T>
    ) {
      return fetcher<CollectApiResponse<{ message: string }>>(`/records`, {
        method: 'DELETE',
        requestData: searchParams
      })
    },
    deleteById(id: Enumerable<string>) {
      if (isArray(id)) {
        return fetcher<CollectApiResponse<{ message: string }>>(`/records`, {
          method: 'DELETE',
          requestData: { ids: id }
        })
      } else {
        return fetcher<CollectApiResponse<{ message: string }>>(
          `/records/${id}`,
          {
            method: 'DELETE'
          }
        )
      }
    },
    detach() {
      // @TODO
    },
    find<T extends CollectObject = CollectObject>(
      searchParams: CollectQuery<T>
    ) {
      return fetcher<CollectApiResponse<T[]>>(`/records/search`, {
        method: 'POST',
        requestData: searchParams
      })
    },
    findById<T extends CollectObject = CollectObject>(id: string) {
      return fetcher<CollectApiResponse<T[]>>(`/records/${id}`, {
        method: 'GET'
      })
    },
    async findOne<T extends CollectObject = CollectObject>(
      searchParams: CollectQuery<T>
    ) {
      const response = await fetcher<CollectApiResponse<T[]>>(
        `/records/search`,
        {
          method: 'POST',
          requestData: searchParams
        }
      )
      const [record] = response.data
      return { ...response, data: record } as CollectApiResponse<T>
    },
    properties<T extends CollectObject = CollectObject>(
      idOrSearchParams: CollectQuery<T> | string,
      searchParams?: CollectQuery<T>
    ) {
      const url =
        typeof idOrSearchParams === 'string'
          ? `/api/v1/records/${idOrSearchParams}/properties`
          : `/api/v1/records/properties`

      const requestData = isObject(idOrSearchParams)
        ? idOrSearchParams
        : searchParams ?? {}

      return fetcher<CollectApiResponse<CollectProperty>>(url, {
        method: 'POST',
        requestData
      })
    },
    update<T extends CollectObject = CollectObject>(
      data: CollectRecordObject | T
    ) {
      // @TODO
      return fetcher<CollectApiResponse<T>>(`/records`, {
        method: 'PATCH',
        requestData: data
      })
    },
    upsert() {
      // @TODO
    }
  },
  tx: {
    begin() {
      // @TODO
    },
    commit() {
      // @TODO
    },
    rollback() {
      // @TODO
    }
  }
})
