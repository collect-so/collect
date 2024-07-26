import type {
  BooleanExpression,
  CollectPropertyExpression,
  CollectPropertyExpressionByType,
  DatetimeExpression,
  LogicalGrouping,
  NullExpression,
  NumberExpression,
  StringExpression
} from './expressions.js'
import type { CollectSchema } from './schema.js'
import type { MaybeArray, RequireAtLeastOne } from './utils.js'

export type CollectQueryRelation = { direction?: 'in' | 'out'; type?: string } | string

export type CollectAggregate<Schema extends CollectSchema = CollectSchema> = {
  // @TODO: separate aggregating functions depending on field type
  [key: string]: Partial<Record<'avg' | 'count' | 'max' | 'min' | 'sum', keyof Schema>>
} & {
  [Key in keyof Schema]?: boolean
}

export type CollectQueryRelatedCondition = {
  [Key in keyof CollectModels]?: {
    // $include?: CollectAggregate<CollectModels[K]> | CollectPaginationClause | true
    $relation?: CollectQueryRelation
  } & CollectQueryWhere<CollectModels[Key]>
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

export type CollectQueryIdExpression =
  | ({ __id?: string } & CollectQueryRelatedCondition)
  | LogicalExpression<{ __id?: string } & CollectQueryRelatedCondition>

export type CollectQueryExpression<Schema extends CollectSchema = CollectSchema> =
  | CollectQueryIdExpression
  | (Schema extends CollectSchema ?
      // When used with actual CollectSchema
      {
        [Key in keyof Schema]?:
          | CollectPropertyExpressionByType[Schema[Key]['type']]
          | LogicalExpression<CollectPropertyExpressionByType[Schema[Key]['type']]>
      }
    : // When used with random object
      {
        [Key in keyof Schema]?: Schema[Key] extends MaybeArray<number> ?
          LogicalExpression<NumberExpression> | NumberExpression
        : Schema[Key] extends MaybeArray<boolean> ?
          BooleanExpression | LogicalExpression<BooleanExpression>
        : Schema[Key] extends MaybeArray<string> ?
          | DatetimeExpression
          | LogicalExpression<DatetimeExpression>
          | LogicalExpression<StringExpression>
          | StringExpression
        : Schema[Key] extends MaybeArray<null> ? LogicalExpression<NullExpression> | NullExpression
        : LogicalExpression | Partial<CollectPropertyExpression>
      })

export type CollectQueryWhere<Schema extends CollectSchema = CollectSchema> =
  | ((CollectQueryExpression<Schema> & CollectQueryRelatedCondition) &
      LogicalGrouping<CollectQueryExpression<Schema> & CollectQueryRelatedCondition>)
  | LogicalGrouping<CollectQueryExpression<Schema> & CollectQueryRelatedCondition>

export type CollectQueryOrder<Schema extends CollectSchema = CollectSchema> =
  | 'asc'
  | 'desc'
  | Partial<Record<keyof Schema, 'asc' | 'desc'>>

// CLAUSES
export type CollectQueryWhereClause<Schema extends CollectSchema = CollectSchema> = {
  where?: CollectQueryWhere<Schema>
}

export type CollectPaginationClause = {
  limit?: number
  skip?: number
}

export type CollectQueryLabelsClause = {
  labels?: string[]
}

export type CollectQueryOrderClause<Schema extends CollectSchema = CollectSchema> = {
  orderBy?: CollectQueryOrder<Schema>
}

export type CollectQuery<Schema extends CollectSchema = any> = CollectQueryLabelsClause &
  CollectPaginationClause &
  CollectQueryOrderClause<Schema> &
  CollectQueryWhereClause<Schema>

/** Redeclare CollectModels type in order to have suggestions over related records fields **/
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CollectModels {}
