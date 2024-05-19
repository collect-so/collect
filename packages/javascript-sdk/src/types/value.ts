import type {
  PROPERTY_TYPE_BOOLEAN,
  PROPERTY_TYPE_DATETIME,
  PROPERTY_TYPE_NULL,
  PROPERTY_TYPE_NUMBER,
  PROPERTY_TYPE_STRING
} from '../common/constants'
import type { CollectPropertyType } from './properties'
import type { Enumerable } from './utils'

// DATETIME
export type CollectDatetimeObject = {
  $day?: number
  $hour?: number
  $microsecond?: number
  $millisecond?: number
  $minute?: number
  $month?: number
  $nanosecond?: number
  $second?: number
  $year: number
}
export type CollectDatetimeValue = CollectDatetimeObject | string

// BOOLEAN
export type CollectBooleanValue = boolean

// NULL
export type CollectNullValue = null

// NUMBER
export type CollectNumberValue = number

// STRING
export type CollectStringValue = string

type CollectPropertySingleValue<TType extends CollectPropertyType = CollectPropertyType> =
  TType extends typeof PROPERTY_TYPE_DATETIME ? CollectDatetimeValue
  : TType extends typeof PROPERTY_TYPE_NUMBER ? CollectNumberValue
  : TType extends typeof PROPERTY_TYPE_STRING ? CollectStringValue
  : TType extends typeof PROPERTY_TYPE_NULL ? CollectNullValue
  : TType extends typeof PROPERTY_TYPE_BOOLEAN ? CollectBooleanValue
  : CollectStringValue

export type CollectPropertyValue<TType extends CollectPropertyType = CollectPropertyType> =
  Enumerable<CollectPropertySingleValue<TType>>
