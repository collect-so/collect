import type { CollectQuery, Enumerable } from '@collect.so/types'

import type { CollectApiResponse } from '../common/types'
import type { createFetcher } from '../network'

// @TODO's
// POST API.attach @TODO
// POST API.detach @TODO
// POST API.upsert @TODO

// Resources
// POST API.findMany
// POST API.findById
// POST API.findOne

// POST API.create
// POST API.createMany

// PATCH API.update
// DELETE API.delete
// DELETE API.deleteMany

// Metadata
// POST API.properties
// POST API.labels
// GET API.values/:propertyId

export type TImportOptions = {
  generateLabels?: boolean
  returnResult?: boolean
  suggestTypes?: boolean
}

export const createApi = (fetcher: ReturnType<typeof createFetcher>) => ({
  create<T extends object = object>(body: {
    label?: string
    options?: TImportOptions
    parentId?: string
    payload: Enumerable<T>
  }) {
    return fetcher<Enumerable<T>>(`/import/json`, {
      method: 'POST',
      requestData: body
    })
  },
  // createRecord(body: RecordPayload) {
  //   return fetcher<RecordPayload>(`/records`, {
  //     method: 'POST',
  //     requestData: body
  //   })
  // },
  // },
  // deleteRecords(searchParams: CollectQuery, label?: Label) {
  //   return fetcher<RecordPayload>(`/records`, { method: 'DELETE' })
  // },
  // deleteRecordById(id: RecordId) {
  //   return fetcher<RecordPayload>(`/entity/${id}`, {
  //     method: 'DELETE'
  //   })

  findRecords<T extends object = object>(searchParams: CollectQuery<T>) {
    return fetcher<CollectApiResponse<T[]>>(`/records/search`, {
      method: 'POST',
      requestData: searchParams
    })
  }

  // linkRecords(id: RecordId, searchParams: CollectQuery, metadata?: AnyObject) {
  //   return fetcher<RecordPayload>(`/records/${id}`, {
  //     method: 'POST',
  //     requestData: {
  //       metadata,
  //       ...searchParams
  //     }
  //   })
  // },
  // updateRecordById: (id: RecordId, body: RecordPayload) => {
  //   return fetcher<RecordPayload>(`/entity/${id}`, {
  //     body: JSON.stringify(body),
  //     method: 'PATCH'
  // search(searchParams: CollectQuery) {
  //   return fetcher<RecordPayload>(`/records/search`, {
  //     method: 'POST',
  //     requestData: searchParams
  //   })
  // },
  // updateRecordWithSearchParams(
  //   searchParams: CollectQuery,
  //   body: RecordPayload
  // ) {
  //   // TODO:
  //   return fetcher<RecordPayload>(`/records`, {
  //     method: 'PATCH',
  //     requestData: body
  //   })
  // }
})
