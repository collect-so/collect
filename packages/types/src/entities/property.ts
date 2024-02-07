import type { CollectDateTimeObject } from '../core'
import type { Enumerable } from '../utils'

export type CollectPropertyType =
  | 'boolean'
  | 'datetime'
  | 'null'
  | 'number'
  | 'string'

export type CollectPrimitiveValue = boolean | null | number | string
export type CollectDatetimeValue = CollectDateTimeObject | string

export type TPropertySingleValue<
  TType extends CollectPropertyType = CollectPropertyType
> = TType extends 'datetime' ? CollectDatetimeValue : CollectPrimitiveValue

export type CollectPropertyValue<
  TType extends CollectPropertyType = CollectPropertyType
> = Enumerable<TPropertySingleValue<TType>>

export type CollectProperty = {
  created: string
  id: string
  lastUsed?: string
  metadata?: string
  name: string
  projectId: string
  type: CollectPropertyType
  value: CollectPropertyValue
}
