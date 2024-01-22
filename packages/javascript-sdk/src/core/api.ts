import type { CollectQuery } from '@collect.so/types'

import type { createFetcher } from '../fetcher/fetcher.js'
import type { CollectApiResponse } from '../types/types.js'

export const createApi = (fetcher: ReturnType<typeof createFetcher>) => ({
  // create(body: RecordPayload) {
  //   return fetcher<RecordPayload>(`/records`, {
  //     method: 'POST',
  //     requestData: body
  //   })
  // },
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
