import type { Enumerable, RequireAtLeastOne } from '../utils'
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

export type CollectPropertySingleValue<TType extends CollectPropertyType = CollectPropertyType> =
  TType extends 'datetime' ? CollectDatetimeValue : CollectPrimitiveValue

export type CollectPropertyValue<TType extends CollectPropertyType = CollectPropertyType> =
  Enumerable<CollectPropertySingleValue<TType>>

export type DatetimeValue =
  | CollectDatetimeObject
  | RequireAtLeastOne<
      Record<'gt' | 'gte' | 'lt' | 'lte' | 'not', CollectDatetimeObject | string> &
        Record<'in' | 'notIn', Array<CollectDatetimeObject | string>>
    >
  | string

export type BooleanValue = Record<'not', boolean> | boolean

export type NullValue = Record<'not', null> | null

export type NumberValue =
  | RequireAtLeastOne<
      Record<'gt' | 'gte' | 'lt' | 'lte' | 'not', number> & Record<'in' | 'notIn', Array<number>>
    >
  | number

export type StringValue =
  | RequireAtLeastOne<
      Record<'contains' | 'endsWith' | 'not' | 'startsWith', string> &
        Record<'in' | 'notIn', Array<string>>
    >
  | string

export type CollectWhereValue = BooleanValue | DatetimeValue | NullValue | NumberValue | StringValue

export type CollectValueByType = {
  boolean: BooleanValue
  datetime: DatetimeValue
  null: NullValue
  number: NumberValue
  string: StringValue
}
