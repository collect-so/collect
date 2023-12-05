import type {
  AnyObject,
  Label, RecordId,
  RecordPayload,
  SearchParams
} from '../types/types.js'
import type { createFetcher } from '../fetcher/fetcher.js'


export const createApi = (fetcher: ReturnType<typeof createFetcher>) => ({
  create(body: RecordPayload) {
    return fetcher<RecordPayload>(`/record`, {
      requestData: body,
      method: 'POST'
    })
  },
  // deleteRecordById(id: RecordId) {
  //   return fetcher<RecordPayload>(`/entity/${id}`, {
  //     method: 'DELETE'
  //   })
  // },
  search(searchParams: SearchParams, label?: Label) {
    return fetcher<RecordPayload>(`/record/search`,{method: "POST", requestData: searchParams})
  },
  createRecord(body: RecordPayload) {
    return fetcher<RecordPayload>(`/record`, {
      requestData: body,
      method: 'POST'
    })
  },
  // deleteRecordById(id: RecordId) {
  //   return fetcher<RecordPayload>(`/entity/${id}`, {
  //     method: 'DELETE'
  //   })
  // },
  deleteRecords(searchParams: SearchParams, label?: Label) {
    return fetcher<RecordPayload>(`/record`, {method: "DELETE"})
  },
  // // TODO:
  findRecords(searchParams: SearchParams, label?: Label) {
    return fetcher<RecordPayload>(`/record/search`,{method: "POST", requestData: searchParams})
  },
  // updateRecordById: (id: RecordId, body: RecordPayload) => {
  //   return fetcher<RecordPayload>(`/entity/${id}`, {
  //     body: JSON.stringify(body),
  //     method: 'PATCH'
  //   })
  linkRecords(id: RecordId, searchParams: SearchParams, metadata?: AnyObject) {
    return fetcher<RecordPayload>(`/record/${id}`, {
      requestData:{
        metadata,
        ...searchParams
      },
      method: 'POST'
    })
  },
  updateRecordWithSearchParams(
    searchParams: SearchParams,
    body: RecordPayload
  ) {
    // TODO:
    return fetcher<RecordPayload>(`/record`, {
      requestData: body,
      method: 'PATCH'
    })
  }
})
