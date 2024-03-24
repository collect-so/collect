import type { CollectObject, CollectProperty, CollectRecord, CollectSchema } from '../core'
import type { CollectApiResponse } from './common'

// GET /api/v1/records/:id
export type CollectGetRecordResponse<T extends CollectObject | CollectSchema = CollectSchema> =
  CollectApiResponse<CollectRecord<T>>

// POST /api/v1/records/ /api/v1/records/:id
export type CollectCreateRecordResponse<T extends CollectObject | CollectSchema = CollectSchema> =
  CollectApiResponse<CollectRecord<T>>

// PUT /api/v1/records/:id
export type CollectUpdateRecordResponse = CollectApiResponse<CollectRecord>
export type CollectUpdateRecordRequest = {
  label?: string
  parentId?: string
  properties?: Array<
    CollectProperty & {
      valueMetadata?: string
      valueSeparator?: string
    }
  >
}

// DELETE /api/v1/records
export type CollectDeleteRecordsResponse = CollectApiResponse<boolean>

// DELETE /api/v1/records/:id
export type CollectDeleteRecordByIdResponse = CollectApiResponse<{
  message: string
}>

// POST /api/v1/records/properties /api/v1/records/:id/properties
export type CollectRecordsPropertiesResponse = CollectApiResponse<CollectProperty[]>

// POST /api/v1/records/:id/relations
export type CollectRecordsRelationsRequest = {
  direction?: 'in' | 'out'
  labels?: string[]
  relations?: string[]
}
export type CollectRecordsRelationsResponse = Array<{
  relations: Array<{ count: number; label: string }>
  type: string
}>
