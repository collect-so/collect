import type {
  BooleanValue,
  CollectObject,
  CollectSchema,
  CollectValueByType,
  CollectWhereValue,
  DatetimeValue,
  NullValue,
  NumberValue,
  StringValue
} from '../core'
import type { Enumerable } from '../utils'

export type CollectQueryLogicalGrouping<T extends CollectObject | CollectSchema = CollectSchema> =
  Record<'AND' | 'NOT' | 'OR' | 'XOR', Enumerable<CollectQueryCondition<T>>>

export type CollectQueryOrderByMap<T extends CollectObject | CollectSchema = CollectSchema> =
  Partial<Record<keyof T, 'asc' | 'desc'>>

export type CollectQueryOrderBy<T extends CollectObject | CollectSchema = CollectSchema> =
  | 'asc'
  | 'desc'
  | CollectQueryOrderByMap<T>

export type CollectQueryCommonParams<T extends CollectObject | CollectSchema = CollectSchema> = {
  labels?: string[]
  limit?: number
  orderBy?: CollectQueryOrderBy<T>
  skip?: number
}

export type CollectQueryCondition<T extends CollectObject | CollectSchema = CollectSchema> = {
  [K in keyof T]?: T extends CollectSchema ? CollectValueByType[T[K]['type']]
  : T[K] extends number ? NumberValue
  : T[K] extends boolean ? BooleanValue
  : T[K] extends string ? DatetimeValue | StringValue
  : T[K] extends null ? NullValue
  : CollectWhereValue
} & {
  [K in keyof CollectModels]?: CollectQueryWhere<CollectModels[K]>
}

export type CollectRelatedQuery<K extends keyof CollectModels = keyof CollectModels> =
  CollectQueryCondition<CollectModels[K]>

export type CollectQueryWhere<T extends CollectObject | CollectSchema = CollectSchema> =
  | CollectQueryCondition<T>
  | Partial<CollectQueryLogicalGrouping<T>>

export type CollectQueryWhereClause<T extends CollectObject | CollectSchema = CollectSchema> = {
  where?: CollectQueryWhere<T>
}

export type CollectQuery<T extends CollectObject | CollectSchema = any> =
  CollectQueryCommonParams<T> & CollectQueryWhereClause<T>

/* Extent this typ*/
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CollectModels {}

//& { includes?: never }
// | (CollectQueryIncludesClause<T> & { where?: never })
// INCLUDES CLAUSE
// export type CollectQueryIncludesClause<T extends CollectObject | CollectSchema = CollectSchema> = {
//   includes?: CollectQueryIncludes<T>
// }
// @TODO: implement inferring relation type from schema
// export type CollectQueryIncludesRelation = {
//   relation: string
// }

// export type CollectQueryIncludes<T extends CollectObject | CollectSchema = CollectSchema> =
//   RequireAtLeastOne<
//     Record<
//       string,
//       Partial<CollectQueryIncludesClause<T>> &
//         CollectQueryWhereClause<T> &
//         CollectQueryCommonParams<T> &
//         Partial<CollectQueryIncludesRelation>
//     >
//   >
