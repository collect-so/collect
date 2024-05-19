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

export type CollectPropertyExpression =
  | BooleanExpression
  | DatetimeExpression
  | NullExpression
  | NumberExpression
  | StringExpression

export type CollectPropertyExpressionByType = {
  boolean: BooleanExpression
  datetime: DatetimeExpression
  null: NullExpression
  number: NumberExpression
  string: StringExpression
}

export type LogicalExpressionValue<T = CollectPropertyExpression> =
  | AndExpression<T>
  | NorExpression<T>
  | NotExpression<T>
  | OrExpression<T>
  | T
  | XorExpression<T>

export type AndExpression<T = CollectPropertyExpression> = {
  $and: LogicalExpressionValue<T[]>
}

export type OrExpression<T = CollectPropertyExpression> = {
  $or: LogicalExpressionValue<T[]>
}

export type NotExpression<T = CollectPropertyExpression> = {
  $not: LogicalExpressionValue<T>
}

export type XorExpression<T = CollectPropertyExpression> = {
  $xor: LogicalExpressionValue<T[]>
}

export type NorExpression<T = CollectPropertyExpression> = {
  $nor: LogicalExpressionValue<T[]>
}

export type LogicalExpression<T = CollectPropertyExpression> = RequireAtLeastOne<
  AndExpression<T> & OrExpression<T> & NotExpression<T> & XorExpression<T> & NorExpression<T>
>
