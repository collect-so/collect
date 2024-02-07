import type {
  CollectProperty,
  CollectPropertyType,
  CollectPropertyValue,
  CollectRecordPlain,
  CollectRecordResponse
} from '../entities'
import type { Enumerable } from '../utils'
import type { CollectApiResponse } from './common'

// POST /api/v1/import/json
export type CollectApiImportJsonRequest<T extends object = object> =
  CollectApiResponse<{
    label?: string
    options?: {
      generateLabels?: boolean
      returnResult?: boolean
      suggestTypes?: boolean
    }
    parentId?: string
    payload: Enumerable<T>
  }>

// GET /api/v1/records/:id
export type CollectGetRecordResponse = CollectApiResponse<CollectRecordResponse>

// POST /api/v1/records/ /api/v1/records/:id
export type CollectCreateRecordResponse =
  CollectApiResponse<CollectRecordResponse>
export type CollectCreateRecordRequest = {
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

// PUT /api/v1/records/:id
export type CollectUpdateRecordResponse =
  CollectApiResponse<CollectRecordResponse>
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
