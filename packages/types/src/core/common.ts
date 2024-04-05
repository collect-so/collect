import type { MaybePromise } from '../utils'
import type { CollectDatetimeObject, CollectPropertyType, CollectPropertyValue } from './index'

export type CollectObject = Record<string, boolean | null | number | string | undefined>

export type CollectSchemaDefaultValue = MaybePromise<CollectPropertyValue>

export type CollectSchema = Record<
  string,
  {
    default?: CollectSchemaDefaultValue
    required?: boolean
    type: CollectPropertyType
    uniq?: boolean
  }
>

export type CollectRelations = Record<
  string,
  {
    model: string
  }
>
// export type CollectRelations = {
//   [K in keyof CollectRelationships]?: () => CollectSchema
// }

// Typings for write ops (create/update)
type TypeMappingWrite = {
  boolean: boolean
  datetime: CollectDatetimeObject | string
  null: null
  number: number
  string: string
}

type OptionalKeysWrite<S extends CollectSchema = CollectSchema> = {
  [P in keyof S]: S[P]['required'] extends false ? P
  : S[P]['default'] extends CollectSchemaDefaultValue ? P
  : never
}[keyof S]

type RequiredKeysWrite<S extends CollectSchema = CollectSchema> = {
  [P in keyof S]: S[P]['required'] extends false ? never
  : S[P]['default'] extends CollectSchemaDefaultValue ? never
  : P
}[keyof S]

export type InferSchemaTypesWrite<S extends CollectSchema = CollectSchema> = {
  [P in RequiredKeysWrite<S>]: TypeMappingWrite[S[P]['type']]
} & {
  [P in OptionalKeysWrite<S>]?: TypeMappingWrite[S[P]['type']]
}

// Typings for read ops (find/findById/findOne)
type TypeMappingRead = {
  boolean: boolean
  datetime: string
  null: null
  number: number
  string: string
}

type OptionalKeysRead<S extends CollectSchema = CollectSchema> = {
  [P in keyof S]: S[P]['required'] extends false ? P : never
}[keyof S]

type RequiredKeysRead<S extends CollectSchema = CollectSchema> = {
  [P in keyof S]: S[P]['required'] extends false ? never : P
}[keyof S]

export type InferSchemaTypesRead<S extends CollectSchema = CollectSchema> = {
  [P in RequiredKeysRead<S>]: TypeMappingRead[S[P]['type']]
} & {
  [P in OptionalKeysRead<S>]?: TypeMappingRead[S[P]['type']]
}
