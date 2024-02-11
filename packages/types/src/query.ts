import type { CollectDateTimeObject, CollectObject } from './core'
import type { CollectPropertyType } from './entities'
import type { Enumerable, RequireAtLeastOne } from './utils'

// Transform CollectObject property types to their respective query operations
// type QueryOperation<TType extends keyof TypeMapping = keyof TypeMapping> =
//   TType extends CollectPropertyType
//     ? OperationByType[TypeMapping[TType]]
//     : never

// Utility type to extract TypeScript type from CollectPropertyType
// type TypeScriptType<TType> = TType extends CollectPropertyType
//   ? TypeMapping[TType]
//   : never

// Adjusted utility type for inferring allowed operations based on CollectPropertyType
// type QueryOperation<T extends CollectPropertyType> = OperationByType[T]
//
// // Utility type for conditional query values remains largely the same
// type ConditionalQueryValue<T extends CollectPropertyType> = T extends 'datetime'
//   ? Enumerable<CollectDateTimeObject | string>
//   : T extends 'number'
//   ? Enumerable<number>
//   : T extends 'string'
//   ? Enumerable<string>
//   : T extends 'boolean'
//   ? boolean
//   : T extends 'null'
//   ? null
//   : never
//
// type CollectQueryConditionValue<
//   T extends CollectSchema = CollectSchema,
//   K extends keyof T = keyof T
// > = {
//   [Op in QueryOperation<T[K]['type']>]+?: Op extends
//     | 'equals'
//     | 'gt'
//     | 'gte'
//     | 'in'
//     | 'lt'
//     | 'lte'
//     | 'not'
//     | 'notIn'
//     ? ConditionalQueryValue<T[K]['type']>
//     : Op extends 'contains' | 'endsWith' | 'startsWith'
//     ? string
//     : never
// }

export type CollectQueryConditionValue<
  T extends CollectObject = CollectObject,
  K extends keyof T = keyof T
> =
  | CollectDateTimeObject
  | Enumerable<number | string>
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

export type CollectQueryLogicalGrouping<
  T extends CollectObject = CollectObject
> = Partial<
  Record<'AND' | 'NOT' | 'OR' | 'XOR', Enumerable<CollectQueryCondition<T>>>
>
export type CollectQueryCommonParams<T extends CollectObject = CollectObject> =
  {
    depth?: '*' | number
    labels?: string[]
    limit?: number
    orderBy?: 'asc' | 'desc' | Partial<Record<keyof T, 'asc' | 'desc'>>
    skip?: number
  }

export type CollectQueryCondition<T extends CollectObject = CollectObject> =
  RequireAtLeastOne<{
    [K in keyof T]?: CollectQueryConditionValue<T, K>
  }>
export type CollectQueryIncludes<T extends CollectObject = CollectObject> =
  RequireAtLeastOne<
    Record<
      string,
      Partial<CollectQueryIncludesClause<T>> &
        CollectQueryWhereClause<T> &
        CollectQueryCommonParams<T>
    >
  >

export type CollectQueryWhere<T extends CollectObject = CollectObject> =
  | CollectQueryCondition<T>
  | RequireAtLeastOne<CollectQueryLogicalGrouping<T>>

export type CollectQueryWhereClause<T extends CollectObject = CollectObject> = {
  where?: CollectQueryWhere<T>
}

// INCLUDES CLAUSE
export type CollectQueryIncludesClause<
  T extends CollectObject = CollectObject
> = {
  includes?: CollectQueryIncludes<T>
}
export type CollectQuery<T extends CollectObject = CollectObject> =
  | (CollectQueryCommonParams<T> &
      CollectQueryWhereClause<T> & { includes?: never })
  | (CollectQueryIncludesClause<T> & { where?: never })
