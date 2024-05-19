import type {
  PROPERTY_TYPE_BOOLEAN,
  PROPERTY_TYPE_DATETIME,
  PROPERTY_TYPE_NULL,
  PROPERTY_TYPE_NUMBER,
  PROPERTY_TYPE_STRING
} from '../common/constants'
import type { CollectPropertyValue } from './value'

export type CollectPropertyType =
  | typeof PROPERTY_TYPE_BOOLEAN
  | typeof PROPERTY_TYPE_DATETIME
  | typeof PROPERTY_TYPE_NULL
  | typeof PROPERTY_TYPE_NUMBER
  | typeof PROPERTY_TYPE_STRING

export type CollectProperty = {
  id: string
  metadata?: string
  name: string
  type: CollectPropertyType
}

export type CollectPropertyWithValue = CollectProperty & {
  value: CollectPropertyValue
}

export type CollectPropertyValuesData = {
  max?: number
  min?: number
  values: CollectPropertyValue[]
}
