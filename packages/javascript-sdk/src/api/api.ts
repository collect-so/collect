import type {
  CollectApiImportJsonRequest,
  CollectApiResponse,
  CollectCreateRecordRequest,
  CollectGetRecordResponse,
  CollectQuery,
  CollectRecordPlain,
  Enumerable
} from '@collect.so/types'

import type { createFetcher } from '../network'

// .findUnique(): Retrieve a single record by its unique identifier.
//
// .findMany(): Retrieve multiple records that match specific criteria.
//
// .create(): Create a new record in the database.
//
// .update(): Update an existing record in the database.
//
// .delete(): Delete a record from the database.
//
// .upsert(): Update or insert a record depending on whether it already exists.
//
// .count(): Count the number of records that match specific criteria.
//
// .groupBy(): Group records based on specific fields.
//
// .orderBy(): Sort records based on specific fields and sorting criteria.
//
// .select(): Specify which fields to retrieve from the database.
//
// .include(): Eagerly load related records from other tables.
//
// .transaction(): Perform multiple database operations within a single transaction.
//
// .raw(): Execute raw SQL queries if needed.
//
// .join(): Perform inner and outer joins between tables.
//
// .where(): Apply filtering conditions to query results.

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
type FetcherResponseType<T> = T extends
  | CollectApiImportJsonRequest
  | Enumerable<CollectRecordPlain>
  ? Enumerable<CollectGetRecordResponse>
  : T extends CollectCreateRecordRequest
  ? CollectGetRecordResponse
  : never

// POST /api/v1/import/json
// GET /api/v1/records/:id
// POST /api/v1/records/ /api/v1/records/:id
// PUT /api/v1/records/:id
// DELETE /api/v1/records
// DELETE /api/v1/records/:id
// POST /api/v1/records/properties /api/v1/records/:id/properties

export const createApi = (fetcher: ReturnType<typeof createFetcher>) => ({
  create<
    T extends
      | CollectApiImportJsonRequest
      | CollectCreateRecordRequest
      | Enumerable<CollectRecordPlain>
  >(body: T) {
    return fetcher<FetcherResponseType<T>>(`/import/json`, {
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
