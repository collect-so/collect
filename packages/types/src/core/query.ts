import type { Enumerable, RequireAtLeastOne } from '../utils'
import type { CollectObject, CollectSchema } from './common'
import type { CollectDatetimeObject } from './index'

type DatetimeValue =
  | CollectDatetimeObject
  | RequireAtLeastOne<
      Record<'gt' | 'gte' | 'lt' | 'lte' | 'not', CollectDatetimeObject | string> &
        Record<'in' | 'notIn', Array<CollectDatetimeObject | string>>
    >
  | string

type BooleanValue = RequireAtLeastOne<Record<'not', boolean>> | boolean

type NullValue = RequireAtLeastOne<Record<'not', null>> | null

type NumberValue =
  | RequireAtLeastOne<
      Record<'gt' | 'gte' | 'lt' | 'lte' | 'not', number> & Record<'in' | 'notIn', Array<number>>
    >
  | number

type StringValue =
  | RequireAtLeastOne<
      Record<'contains' | 'endsWith' | 'not' | 'startsWith', string> &
        Record<'in' | 'notIn', Array<string>>
    >
  | string

type CollectWhereValue = BooleanValue | DatetimeValue | NullValue | NumberValue | StringValue

type CollectWhereValueByType = {
  boolean: BooleanValue
  datetime: DatetimeValue
  null: NullValue
  number: NumberValue
  string: StringValue
}

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
  [K in keyof T]?: T extends CollectSchema ? CollectWhereValueByType[T[K]['type']]
  : T[K] extends number ? NumberValue
  : T[K] extends boolean ? BooleanValue
  : T[K] extends string ? DatetimeValue | StringValue
  : T[K] extends null ? NullValue
  : CollectWhereValue
}

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

export type CollectQueryWhere<T extends CollectObject | CollectSchema = CollectSchema> =
  | CollectQueryCondition<T>
  | RequireAtLeastOne<CollectQueryLogicalGrouping<T>>

export type CollectQueryWhereClause<T extends CollectObject | CollectSchema = CollectSchema> = {
  where?: CollectQueryWhere<T>
}

// INCLUDES CLAUSE
// export type CollectQueryIncludesClause<T extends CollectObject | CollectSchema = CollectSchema> = {
//   includes?: CollectQueryIncludes<T>
// }
export type CollectQuery<T extends CollectObject | CollectSchema = CollectSchema> =
  CollectQueryCommonParams<T> & CollectQueryWhereClause<T> & { includes?: never }
// | (CollectQueryIncludesClause<T> & { where?: never })
