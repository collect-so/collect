import type {
  CollectDateTimeObject,
  CollectObject,
  CollectSchema
} from './core'
import type { Enumerable, RequireAtLeastOne } from './utils'

type DatetimeValue =
  | CollectDateTimeObject
  | RequireAtLeastOne<
      Record<
        'gt' | 'gte' | 'lt' | 'lte' | 'not',
        CollectDateTimeObject | string
      >
    >
  | RequireAtLeastOne<
      Record<'in' | 'notIn', Array<CollectDateTimeObject | string>>
    >
  | string
type BooleanValue = RequireAtLeastOne<Record<'not', boolean>> | boolean
type NullValue = RequireAtLeastOne<Record<'not', null>> | null
type NumberValue =
  | RequireAtLeastOne<Record<'gt' | 'gte' | 'lt' | 'lte' | 'not', number>>
  | RequireAtLeastOne<Record<'in' | 'notIn', Array<number>>>
  | number
type StringValue =
  | RequireAtLeastOne<
      Record<'contains' | 'endsWith' | 'not' | 'startsWith', string>
    >
  | RequireAtLeastOne<Record<'in' | 'notIn', Array<string>>>
  | string

type CollectWhereValue =
  | BooleanValue
  | DatetimeValue
  | NullValue
  | NumberValue
  | StringValue

type CollectWhereValueByType = {
  boolean: BooleanValue
  datetime: DatetimeValue
  null: NullValue
  number: NumberValue
  string: StringValue
}

export type CollectQueryLogicalGrouping<
  T extends CollectObject | CollectSchema = CollectSchema
> = Partial<
  Record<'AND' | 'NOT' | 'OR' | 'XOR', Enumerable<CollectQueryCondition<T>>>
>
export type CollectQueryCommonParams<
  T extends CollectObject | CollectSchema = CollectSchema
> = {
  depth?: '*' | number
  labels?: string[]
  limit?: number
  orderBy?: 'asc' | 'desc' | Partial<Record<keyof T, 'asc' | 'desc'>>
  skip?: number
}

export type CollectQueryCondition<
  T extends CollectObject | CollectSchema = CollectSchema
> = {
  [K in keyof T]?: T extends CollectSchema
    ? CollectWhereValueByType[T[K]['type']]
    : T[K] extends number
    ? CollectWhereValueByType['number']
    : T[K] extends boolean
    ? CollectWhereValueByType['boolean']
    : T[K] extends string
    ? CollectWhereValueByType['datetime'] | CollectWhereValueByType['string']
    : T[K] extends null
    ? CollectWhereValueByType['null']
    : CollectWhereValue
}

// @TODO: implement inferring relation type from schema
export type CollectQueryIncludesRelation = {
  relation: string
}

export type CollectQueryIncludes<
  T extends CollectObject | CollectSchema = CollectSchema
> = RequireAtLeastOne<
  Record<
    string,
    Partial<CollectQueryIncludesClause<T>> &
      CollectQueryWhereClause<T> &
      CollectQueryCommonParams<T> &
      Partial<CollectQueryIncludesRelation>
  >
>

export type CollectQueryWhere<
  T extends CollectObject | CollectSchema = CollectSchema
> = CollectQueryCondition<T> | RequireAtLeastOne<CollectQueryLogicalGrouping<T>>

export type CollectQueryWhereClause<
  T extends CollectObject | CollectSchema = CollectSchema
> = {
  where?: CollectQueryWhere<T>
}

// INCLUDES CLAUSE
export type CollectQueryIncludesClause<
  T extends CollectObject | CollectSchema = CollectSchema
> = {
  includes?: CollectQueryIncludes<T>
}
export type CollectQuery<
  T extends CollectObject | CollectSchema = CollectSchema
> =
  | (CollectQueryCommonParams<T> &
      CollectQueryWhereClause<T> & { includes?: never })
  | (CollectQueryIncludesClause<T> & { where?: never })
