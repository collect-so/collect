import type { CollectSchema } from './common'
import type { Enumerable } from './utils'
import type {
  BooleanValue,
  CollectValueByType,
  CollectWhereValue,
  DatetimeValue,
  NullValue,
  NumberValue,
  StringValue
} from './value'

export type CollectQueryLogicalGrouping<T extends CollectSchema = CollectSchema> = Record<
  '$AND' | '$NOT' | '$OR' | '$XOR',
  Enumerable<CollectQueryCondition<T>>
>

export type CollectQueryOrderByMap<T extends CollectSchema = CollectSchema> = Partial<
  Record<keyof T, 'asc' | 'desc'>
>

export type CollectQueryOrderBy<T extends CollectSchema = CollectSchema> =
  | 'asc'
  | 'desc'
  | CollectQueryOrderByMap<T>

export type CollectQueryCommonParams<T extends CollectSchema = CollectSchema> = {
  labels?: string[]
  limit?: number
  orderBy?: CollectQueryOrderBy<T>
  skip?: number
}

export type CollectQueryCondition<T extends CollectSchema = CollectSchema> = (
  | {
      [K in keyof T]?: T extends CollectSchema ? CollectValueByType[T[K]['type']]
      : T[K] extends number ? NumberValue
      : T[K] extends boolean ? BooleanValue
      : T[K] extends string ? DatetimeValue | StringValue
      : T[K] extends null ? NullValue
      : Partial<CollectWhereValue>
    }
  | { __id?: string }
) & {
  [K in keyof CollectModels]?: CollectQueryWhere<CollectModels[K]>
}

export type CollectQueryWhere<T extends CollectSchema = CollectSchema> =
  | CollectQueryCondition<T>
  | Partial<CollectQueryLogicalGrouping<T>>

export type CollectQueryWhereClause<T extends CollectSchema = CollectSchema> = {
  where?: CollectQueryWhere<T>
}

export type CollectQuery<T extends CollectSchema = any> = CollectQueryCommonParams<T> &
  CollectQueryWhereClause<T>

/* Extend this type */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CollectModels {}

// | (CollectQueryIncludesClause<T> & { where?: never })
// INCLUDE CLAUSE
// export type CollectQueryIncludesClause<T extends CollectSchema = CollectSchema> = {
//   include?: CollectQueryIncludes<T>
// }
// export type CollectQueryIncludes<T extends CollectSchema = CollectSchema> =
//   RequireAtLeastOne<
//     Record<
//       string,
//       Partial<CollectQueryIncludesClause<T>> &
//         CollectQueryWhereClause<T> &
//         CollectQueryCommonParams<T> &
//         Partial<CollectQueryIncludesRelation>
//     >
//   >
