import type {
  // BooleanValue,
  // CollectObject,
  CollectSchema
  // CollectValueByType,
  // CollectWhereValue,
  // DatetimeValue,
  // NullValue,
  // NumberValue,
  // StringValue
} from '../core'
// import type { RequireAtLeastOne } from '../utils'
// import type { CollectQueryCondition, CollectQueryLogicalGrouping } from './query'

// const userSchema: CollectSchema = {
//   age: { type: 'number' },
//   dateOfBirth: { required: false, type: 'datetime' },
//   favoriteFood: { type: 'string' },
//   favoriteNumber: { type: 'number' },
//   height: { type: 'number' },
//   id: { type: 'number' },
//   jobTitle: { type: 'string' },
//   married: { type: 'boolean' },
//   name: { type: 'string' },
//   otherDate: { required: false, type: 'datetime' },
//   registeredAt: { required: false, type: 'datetime' },
//   secondCitizenship: { required: false, type: 'null' },
//   weight: { required: false, type: 'number' }
// } as const
//
// const postSchema: CollectSchema = {
//   content: { type: 'string' },
//   created: { type: 'datetime' },
//   title: { type: 'string' }
// } as const
//
// const commentSchema: CollectSchema = {
//   content: { type: 'string' },
//   replyTo: { type: 'string' }
// } as const

// export interface CollectRelationships {}

// // 2. Define recursive type for related queries
//
// type CollectRelatedQuery<T extends CollectObject | CollectSchema = CollectSchema> = {
//   // [K in keyof T & string]?: T[K] extends CollectObject | CollectSchema ?
//   //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   //   // @ts-ignore
//   //   CollectRelatedQueryInternal<T[K], CollectRelationships[K]> | CollectValueByType[T[K]['type']]
//   // : T[K] extends number ? NumberValue
//   // : T[K] extends boolean ? BooleanValue
//   // : T[K] extends string ? DatetimeValue | StringValue
//   // : T[K] extends null ? NullValue
//   // : CollectWhereValue
//
//   [K in keyof T]?: T extends CollectSchema ? CollectValueByType[T[K]['type']]
//   : T[K] extends number ? NumberValue
//   : T[K] extends boolean ? BooleanValue
//   : T[K] extends string ? DatetimeValue | StringValue
//   : T[K] extends null ? NullValue
//   : CollectWhereValue
// }
//
// type CollectRelatedQueryInternal<T extends CollectObject | CollectSchema, R extends string[]> =
//   R extends [] ?
//     never // No more relationships to traverse
//   : {
//       [K in R[number]]?:
//         | CollectQueryCondition<T>
//         | CollectRelatedQueryInternal<T, Exclude<R, K>>
//         | RequireAtLeastOne<CollectQueryLogicalGrouping<T>>
//     }
