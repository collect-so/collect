import type { CollectSchema } from '../common/types'
import type {
  BooleanExpression,
  CollectExpressionByType,
  CollectWhereExpression,
  DatetimeExpression,
  NullExpression,
  NumberExpression,
  StringExpression
} from './expressions'
import type { Enumerable } from './utils'

export type CollectQueryLogicalGrouping<T extends CollectSchema = CollectSchema> = Record<
  '$and' | '$not' | '$or' | '$xor',
  Enumerable<CollectQueryCondition<T>>
>

export type CollectQueryOrderByMap<T extends CollectSchema = CollectSchema> = Partial<
  Record<keyof T, 'asc' | 'desc'>
>

export type CollectQueryOrderBy<T extends CollectSchema = CollectSchema> =
  | 'asc'
  | 'desc'
  | CollectQueryOrderByMap<T>

type CollectPagination = {
  limit?: number
  skip?: number
}

export type CollectQueryRelation = { direction?: 'in' | 'out'; type?: string } | string

export type CollectQueryRelatedCondition = {
  [K in keyof CollectModels]?: {
    $relation?: CollectQueryRelation
  } & CollectQueryWhere<CollectModels[K]>
}

export type CollectQueryCommonParams<T extends CollectSchema = CollectSchema> = {
  labels?: string[]
  orderBy?: CollectQueryOrderBy<T>
} & CollectPagination

export type CollectQueryCondition<T extends CollectSchema = CollectSchema> = (
  | {
      [K in keyof T]?: T extends CollectSchema ? CollectExpressionByType[T[K]['type']]
      : T[K] extends number ? NumberExpression
      : T[K] extends boolean ? BooleanExpression
      : T[K] extends string ? DatetimeExpression | StringExpression
      : T[K] extends null ? NullExpression
      : Partial<CollectWhereExpression>
    }
  | { __id?: string }
) &
  CollectQueryRelatedCondition

export type CollectQueryWhere<T extends CollectSchema = CollectSchema> =
  | CollectQueryCondition<T>
  | Partial<CollectQueryLogicalGrouping<T>>

export type CollectQueryWhereClause<T extends CollectSchema = CollectSchema> = {
  where?: CollectQueryWhere<T>
}

export type CollectQuery<T extends CollectSchema = any> = CollectQueryCommonParams<T> &
  CollectQueryWhereClause<T>

// @TODO: Eager fetching
// export type CollectInclude = {
//   [K in keyof CollectModels]?: CollectPagination | boolean
// }

/** Redeclare CollectModels type in order to have suggestions over related records fields **/
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CollectModels {}
