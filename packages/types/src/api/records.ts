import type {
  CollectObject,
  CollectProperty,
  CollectPropertyType,
  CollectPropertyValue,
  CollectRecord,
  CollectSchema
} from '../core'
import type { CollectApiResponse } from './common'

// POST /api/v1/import/json

// GET /api/v1/records/:id
export type CollectGetRecordResponse<
  T extends CollectObject | CollectSchema = CollectSchema
> = CollectApiResponse<CollectRecord<T>>

// POST /api/v1/records/ /api/v1/records/:id
export type CollectCreateRecordResponse<
  T extends CollectObject | CollectSchema = CollectSchema
> = CollectApiResponse<CollectRecord<T>>

// PUT /api/v1/records/:id
export type CollectUpdateRecordResponse = CollectApiResponse<CollectRecord>
export type CollectUpdateRecordRequest = {
  label?: string
  parentId?: string
  properties?: Array<{
    metadata?: string
    name: string
    type: CollectPropertyType
    value: CollectPropertyValue
    valueMetadata?: string
    valueSeparator?: string
  }>
}

// DELETE /api/v1/records
export type CollectDeleteRecordsResponse = CollectApiResponse<boolean>

// DELETE /api/v1/records/:id
export type CollectDeleteRecordByIdResponse = CollectApiResponse<{
  message: string
}>

// POST /api/v1/records/properties /api/v1/records/:id/properties
export type CollectRecordsPropertiesResponse = CollectApiResponse<
  Omit<CollectProperty, 'value'>[]
>

// POST /api/v1/records/:id/relations
// @TODO
