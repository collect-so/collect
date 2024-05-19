import type { RequireAtLeastOne } from './utils'
import type {
  CollectBooleanValue,
  CollectDatetimeObject,
  CollectDatetimeValue,
  CollectNullValue,
  CollectNumberValue,
  CollectStringValue
} from './value'

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
