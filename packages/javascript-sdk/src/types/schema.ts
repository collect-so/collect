import type { FlattenTypes, MaybePromise } from './utils.js'
import type { CollectDatetimeObject, CollectPropertyType, CollectPropertyValue } from './value.js'

export type CollectSchemaDefaultValue<T extends CollectPropertyType = CollectPropertyType> =
  MaybePromise<CollectPropertyValue<T>>

export type CollectSchemaField<T extends CollectPropertyType = CollectPropertyType> = {
  default?: CollectSchemaDefaultValue<T>
  multiple?: boolean
  required?: boolean
  type: T
  uniq?: boolean
}

export type CollectSchema = Record<string, CollectSchemaField>

// Typings for write ops (create/update)
type TypeMappingWrite = {
  boolean: boolean
  datetime: CollectDatetimeObject | string
  null: null
  number: number
  string: string
}

export type OptionalKeysWrite<Schema extends CollectSchema = CollectSchema> = {
  [Key in keyof Schema]: Schema[Key]['required'] extends false ? Key
  : Schema[Key]['default'] extends CollectSchemaDefaultValue ? Key
  : never
}[keyof Schema]

export type RequiredKeysWrite<Schema extends CollectSchema = CollectSchema> = {
  [Key in keyof Schema]: Schema[Key]['required'] extends false ? never
  : Schema[Key]['default'] extends CollectSchemaDefaultValue ? never
  : Key
}[keyof Schema]

export type InferSchemaTypesWrite<Schema extends CollectSchema = CollectSchema> = FlattenTypes<
  {
    [Key in RequiredKeysWrite<Schema>]: Schema[Key]['multiple'] extends true ?
      TypeMappingWrite[Schema[Key]['type']][]
    : TypeMappingWrite[Schema[Key]['type']]
  } & {
    [Key in OptionalKeysWrite<Schema>]?: Schema[Key]['multiple'] extends true ?
      TypeMappingWrite[Schema[Key]['type']][]
    : TypeMappingWrite[Schema[Key]['type']]
  }
>

// Typings for read ops (find/findById/findOne)
type TypeMappingRead = {
  boolean: boolean
  datetime: string
  null: null
  number: number
  string: string
}

export type OptionalKeysRead<Schema extends CollectSchema = CollectSchema> = {
  [Key in keyof Schema]: Schema[Key]['required'] extends false ? Key : never
}[keyof Schema]

export type RequiredKeysRead<Schema extends CollectSchema = CollectSchema> = {
  [Key in keyof Schema]: Schema[Key]['required'] extends false ? never : Key
}[keyof Schema]

export type InferSchemaTypesRead<Schema extends CollectSchema = CollectSchema> = FlattenTypes<
  {
    [Key in RequiredKeysRead<Schema>]: Schema[Key]['multiple'] extends true ?
      TypeMappingRead[Schema[Key]['type']][]
    : TypeMappingRead[Schema[Key]['type']]
  } & {
    [Key in OptionalKeysRead<Schema>]?: Schema[Key]['multiple'] extends true ?
      TypeMappingRead[Schema[Key]['type']][]
    : TypeMappingRead[Schema[Key]['type']]
  }
>
