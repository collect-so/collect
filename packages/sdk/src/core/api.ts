import type {
  AnyObject,
  Label,
  RecordId,
  RecordPayload,
  SearchParams
} from '../types'
import type { createFetcher } from './fetcher'

export const createApi = (fetcher: ReturnType<typeof createFetcher>) => ({
  createRecord(body: RecordPayload) {
    return fetcher<RecordPayload>(`/api/v1/entity`, {
      body: JSON.stringify(body),
      method: 'POST'
    })
  },
  // deleteRecordById(id: RecordId) {
  //   return fetcher<RecordPayload>(`/api/v1/entity/${id}`, {
  //     method: 'DELETE'
  //   })
  // },
  deleteRecords(searchParams: SearchParams, label?: Label) {
    return fetcher<RecordPayload>(`/api/v1/entity`)
  },
  // TODO:
  findRecords(searchParams: SearchParams, label?: Label) {
    return fetcher<RecordPayload>(`/api/v1/entity`)
  },
  // updateRecordById: (id: RecordId, body: RecordPayload) => {
  //   return fetcher<RecordPayload>(`/api/v1/entity/${id}`, {
  //     body: JSON.stringify(body),
  //     method: 'PATCH'
  //   })
  linkRecords(id: RecordId, searchParams: SearchParams, metadata?: AnyObject) {
    return fetcher<RecordPayload>(`/api/v1/entity/${id}`, {
      body: JSON.stringify({
        metadata,
        ...searchParams
      }),
      method: 'POST'
    })
  },
  updateRecordWithSearchParams(
    searchParams: SearchParams,
    body: RecordPayload
  ) {
    // TODO:
    return fetcher<RecordPayload>(`/api/v1/entity/`, {
      body: JSON.stringify(body),
      method: 'PATCH'
    })
  }
})
