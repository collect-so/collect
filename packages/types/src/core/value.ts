import type { Enumerable } from '../utils'
import type { CollectPropertyType } from './properties'

export type CollectDatetimeObject = {
  day?: number
  hour?: number
  microsecond?: number
  millisecond?: number
  minute?: number
  month?: number
  nanosecond?: number
  second?: number
  year: number
}
export type CollectPrimitiveValue = boolean | null | number | string
export type CollectDatetimeValue = CollectDatetimeObject | string
export type TPropertySingleValue<
  TType extends CollectPropertyType = CollectPropertyType
> = TType extends 'datetime' ? CollectDatetimeValue : CollectPrimitiveValue
export type CollectPropertyValue<
  TType extends CollectPropertyType = CollectPropertyType
> = Enumerable<TPropertySingleValue<TType>>
