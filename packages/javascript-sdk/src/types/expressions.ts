import type {
  PROPERTY_TYPE_BOOLEAN,
  PROPERTY_TYPE_DATETIME,
  PROPERTY_TYPE_NULL,
  PROPERTY_TYPE_NUMBER,
  PROPERTY_TYPE_STRING
} from '../common/constants.js'
import type { MaybeArray, RequireAtLeastOne } from './utils.js'
import type {
  CollectBooleanValue,
  CollectDatetimeObject,
  CollectDatetimeValue,
  CollectNullValue,
  CollectNumberValue,
  CollectStringValue
} from './value.js'

export type DatetimeExpression =
  | CollectDatetimeValue
  | RequireAtLeastOne<
      Record<
        '$gt' | '$gte' | '$lt' | '$lte' | '$ne',
        CollectDatetimeObject | CollectDatetimeValue
      > &
        Record<'$in' | '$nin', Array<CollectDatetimeObject | CollectDatetimeValue>>
    >

export type BooleanExpression = CollectBooleanValue | Record<'$ne', CollectBooleanValue>

export type NullExpression = CollectNullValue | Record<'$ne', CollectNullValue>

export type NumberExpression =
  | CollectNumberValue
  | RequireAtLeastOne<
      Record<'$gt' | '$gte' | '$lt' | '$lte' | '$ne', CollectNumberValue> &
        Record<'$in' | '$nin', Array<CollectNumberValue>>
    >

export type StringExpression =
  | CollectStringValue
  | RequireAtLeastOne<
      Record<'$contains' | '$endsWith' | '$ne' | '$startsWith', CollectStringValue> &
        Record<'$in' | '$nin', Array<CollectStringValue>>
    >

export type CollectPropertyExpression =
  | BooleanExpression
  | DatetimeExpression
  | NullExpression
  | NumberExpression
  | StringExpression

export type CollectPropertyExpressionByType = {
  [PROPERTY_TYPE_BOOLEAN]: BooleanExpression
  [PROPERTY_TYPE_DATETIME]: DatetimeExpression
  [PROPERTY_TYPE_NULL]: NullExpression
  [PROPERTY_TYPE_NUMBER]: NumberExpression
  [PROPERTY_TYPE_STRING]: StringExpression
}

// Logical Expressions
export type LogicalGrouping<T> = Partial<{
  $and: MaybeArray<T>
  $nor: MaybeArray<T>
  $not: MaybeArray<T>
  $or: MaybeArray<T>
  $xor: MaybeArray<T>
}>
