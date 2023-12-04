import type {
  Label,
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
  delete(searchParams: SearchParams, label?: Label) {
    return fetcher<RecordPayload>(`/record`,{method: "GET"})
  },
  // TODO:
  find(searchParams: SearchParams, label?: Label) {
    return fetcher<RecordPayload>(`/record`, {method: "GET"})
  },
  // updateRecordById: (id: RecordId, body: RecordPayload) => {
  //   return fetcher<RecordPayload>(`/entity/${id}`, {
  //     body: JSON.stringify(body),
  //     method: 'PATCH'
  //   })
  // linkRecords(id: RecordId, searchParams: SearchParams, metadata?: AnyObject) {
  //   return fetcher<RecordPayload>(`/entity/${id}`, {
  //     requestData: {
  //       metadata,
  //       ...searchParams
  //     },
  //     method: 'POST'
  //   })
  // },
  // updateRecordWithSearchParams(
  //   searchParams: SearchParams,
  //   body: RecordPayload
  // ) {
  //   // TODO:
  //   return fetcher<RecordPayload>(`/entity/`, {
  //     requestData: body,
  //     method: 'PATCH'
  //   })
  // }
})
