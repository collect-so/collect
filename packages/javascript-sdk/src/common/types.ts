import type {
  PROPERTY_TYPE_BOOLEAN,
  PROPERTY_TYPE_DATETIME,
  PROPERTY_TYPE_NULL,
  PROPERTY_TYPE_NUMBER,
  PROPERTY_TYPE_STRING
} from './constants'

export type Label = string

export type PropertyType = 'boolean' | 'datetime' | 'number' | 'string'

export type CollectApiResponse<T> = {
  data: T
  success: boolean
  total?: number
}
export type TPropertyType =
  | typeof PROPERTY_TYPE_BOOLEAN
  | typeof PROPERTY_TYPE_DATETIME
  | typeof PROPERTY_TYPE_NULL
  | typeof PROPERTY_TYPE_NUMBER
  | typeof PROPERTY_TYPE_STRING
