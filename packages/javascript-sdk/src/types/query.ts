import type { CollectSchema } from './common'
import type { MaybeArray, RequireAtLeastOne } from './utils'
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

// Logical Expressions
export type LogicalGrouping<T> = Partial<{
  $and: MaybeArray<T>
  $nor: MaybeArray<T>
  $not: MaybeArray<T>
  $or: MaybeArray<T>
  $xor: MaybeArray<T>
}>

export type CollectQueryRelation = { direction?: 'in' | 'out'; type?: string } | string

export type CollectQueryRelatedCondition = {
  [K in keyof CollectModels]?: {
    $relation?: CollectQueryRelation
  } & CollectQueryWhere<CollectModels[K]>
}

export type LogicalExpressionValue<T = CollectPropertyExpression & CollectQueryRelatedCondition> =
  | AndExpression<T>
  | NorExpression<T>
  | NotExpression<T>
  | OrExpression<T>
  | T
  | XorExpression<T>

export type AndExpression<T = CollectPropertyExpression & CollectQueryRelatedCondition> = {
  $and: MaybeArray<LogicalExpressionValue<T>>
}

export type OrExpression<T = CollectPropertyExpression & CollectQueryRelatedCondition> = {
  $or: MaybeArray<LogicalExpressionValue<T>>
}

export type NotExpression<T = CollectPropertyExpression & CollectQueryRelatedCondition> = {
  $not: MaybeArray<LogicalExpressionValue<T>>
}

export type XorExpression<T = CollectPropertyExpression & CollectQueryRelatedCondition> = {
  $xor: MaybeArray<LogicalExpressionValue<T>>
}

export type NorExpression<T = CollectPropertyExpression & CollectQueryRelatedCondition> = {
  $nor: MaybeArray<LogicalExpressionValue<T>>
}

export type LogicalExpression<T = CollectPropertyExpression & CollectQueryRelatedCondition> =
  RequireAtLeastOne<
    AndExpression<T> & OrExpression<T> & NotExpression<T> & XorExpression<T> & NorExpression<T>
  >

export type CollectQueryIdExpression = { __id?: string } | LogicalExpression<{ __id?: string }>

export type CollectQueryExpression<T extends CollectSchema = CollectSchema> =
  | {
      [K in keyof T]?: T extends CollectSchema ?
        | CollectPropertyExpressionByType[T[K]['type']]
        | LogicalExpression<CollectPropertyExpressionByType[T[K]['type']]>
      : T[K] extends number ? LogicalExpression<NumberExpression> | NumberExpression
      : T[K] extends boolean ? BooleanExpression | LogicalExpression<BooleanExpression>
      : T[K] extends string ?
        | DatetimeExpression
        | LogicalExpression<DatetimeExpression>
        | LogicalExpression<StringExpression>
        | StringExpression
      : T[K] extends null ? LogicalExpression<NullExpression> | NullExpression
      : LogicalExpression | Partial<CollectPropertyExpression>
    }
  | CollectQueryIdExpression

export type CollectQueryWhere<T extends CollectSchema = CollectSchema> =
  | ((CollectQueryExpression<T> & CollectQueryRelatedCondition) &
      LogicalGrouping<CollectQueryExpression<T> & CollectQueryRelatedCondition>)
  | LogicalGrouping<CollectQueryExpression<T> & CollectQueryRelatedCondition>

export type CollectQueryOrder<T extends CollectSchema = CollectSchema> =
  | 'asc'
  | 'desc'
  | Partial<Record<keyof T, 'asc' | 'desc'>>

// CLAUSES
export type CollectQueryWhereClause<T extends CollectSchema = CollectSchema> = {
  where?: CollectQueryWhere<T>
}

export type CollectPaginationClause = {
  limit?: number
  skip?: number
}

export type CollectQueryLabelsClause = {
  labels?: string[]
}

export type CollectQueryOrderClause<T extends CollectSchema = CollectSchema> = {
  orderBy?: CollectQueryOrder<T>
}

export type CollectQuery<T extends CollectSchema = any> = CollectQueryLabelsClause &
  CollectPaginationClause &
  CollectQueryOrderClause<T> &
  CollectQueryWhereClause<T>

/** Redeclare CollectModels type in order to have suggestions over related records fields **/
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CollectModels {}
