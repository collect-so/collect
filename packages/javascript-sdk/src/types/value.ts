import type { CollectPropertyType } from './properties'
import type { Enumerable, RequireAtLeastOne } from './utils'

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

// DATETIME
export type CollectDatetimeValue = CollectDatetimeObject | string
export type DatetimeExpression =
  | CollectDatetimeValue
  | RequireAtLeastOne<
      Record<
        '$gt' | '$gte' | '$lt' | '$lte' | '$ne',
        CollectDatetimeObject | CollectDatetimeValue
      > &
        Record<'$in' | '$nin', Array<CollectDatetimeObject | CollectDatetimeValue>>
    >

// BOOLEAN
export type CollectBooleanValue = boolean
export type BooleanExpression = CollectBooleanValue | Record<'$ne', CollectBooleanValue>

// NULL
export type CollectNullValue = null
export type NullExpression = CollectNullValue | Record<'$ne', CollectNullValue>

// NUMBER
export type CollectNumberValue = number
export type NumberExpression =
  | CollectNumberValue
  | RequireAtLeastOne<
      Record<'$gt' | '$gte' | '$lt' | '$lte' | '$ne', CollectNumberValue> &
        Record<'$in' | '$nin', Array<CollectNumberValue>>
    >

// STRING
export type CollectStringValue = string
export type StringExpression =
  | CollectStringValue
  | RequireAtLeastOne<
      Record<'$contains' | '$endsWith' | '$ne' | '$startsWith', CollectStringValue> &
        Record<'$in' | '$nin', Array<CollectStringValue>>
    >

export type CollectWhereExpression =
  | BooleanExpression
  | DatetimeExpression
  | NullExpression
  | NumberExpression
  | StringExpression

export type CollectExpressionByType = {
  boolean: BooleanExpression
  datetime: DatetimeExpression
  null: NullExpression
  number: NumberExpression
  string: StringExpression
}

type CollectPrimitiveValue =
  | CollectBooleanValue
  | CollectNullValue
  | CollectNumberValue
  | CollectStringValue

type CollectPropertySingleValue<TType extends CollectPropertyType = CollectPropertyType> =
  TType extends 'datetime' ? CollectDatetimeValue : CollectPrimitiveValue

export type CollectPropertyValue<TType extends CollectPropertyType = CollectPropertyType> =
  Enumerable<CollectPropertySingleValue<TType>>
