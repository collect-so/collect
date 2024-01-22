import type { CollectDateTimeObject } from './core'
import type { Enumerable, RequireAtLeastOne } from './utils'

export type CollectQueryConditionValue<
  T extends object = object,
  K extends keyof T = keyof T
> =
  | CollectDateTimeObject
  | Record<
    'equals' | 'not',
    CollectDateTimeObject | boolean | null | number | string
  >
  | RequireAtLeastOne<
    Record<'gt' | 'gte' | 'lt' | 'lte', CollectDateTimeObject | number>
  >
  | RequireAtLeastOne<
    Record<'in' | 'notIn', Array<CollectDateTimeObject | number | string>>
  >
  | RequireAtLeastOne<Record<'contains' | 'endsWith' | 'startsWith', string>>
  | boolean
  | null
  | number
  | string
export type CollectQueryLogicalGroupingMap<T extends object = object> = Partial<
  Record<'AND' | 'NOT' | 'OR' | 'XOR', T>
>
export type CollectQueryCommonParams<T extends object = object> = {
  limit?: number
  orderBy?: Partial<Record<keyof T, 'asc' | 'desc'>>
  skip?: number
}
export type CollectQueryWhereParams = {
  depth?: '*' | number
  labels?: string[]
}
export type CollectQueryCondition<T extends object = object> =
  RequireAtLeastOne<{
    [K in keyof T]?: CollectQueryConditionValue<T, K>
  }>
export type CollectQueryIncludes<T extends object = object> = RequireAtLeastOne<
  Record<
    string,
    Partial<CollectQueryIncludesClause<T>> &
    CollectQueryWhereClause<T> &
    CollectQueryCommonParams<T>
  >
>
export type CollectQueryWhereClause<T extends object = object> = {
  // pick?: '*' | Array<keyof T | string>
  where?:
  | CollectQueryCondition<T>
  | RequireAtLeastOne<
    CollectQueryLogicalGroupingMap<Enumerable<CollectQueryCondition<T>>>
  >
}
// INCLUDES CLAUSE
export type CollectQueryIncludesClause<T extends object = object> = {
  includes?: CollectQueryIncludes<T>
}
export type CollectQuery<T extends object = any> =
  | (CollectQueryCommonParams<T> &
    CollectQueryWhereClause<T> &
    CollectQueryWhereParams & { includes?: never })
  | (CollectQueryIncludesClause<T> & { where?: never })

