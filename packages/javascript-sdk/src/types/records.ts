import type { CollectRecordInstance, CollectRecordsArrayInstance } from '../sdk/instance'
import type { CollectModel } from '../sdk/model'
import type { CollectSchema, CollectSchemaDefaultValue } from './common'
import type { FlattenTypes, MaybeArray } from './utils'
import type { CollectDatetimeObject, CollectPropertyType } from './value'

export type CollectRecordInternalProps<T extends CollectSchema = CollectSchema> = {
  __id: string
  __label?: string
  __proptypes?: Record<keyof T, CollectPropertyType>
}

// Common Type Mappings
type TypeMapping<T> = {
  boolean: boolean
  datetime: T
  null: null
  number: number
  string: string
}

// Typings for write ops (create/update)
type TypeMappingWrite = TypeMapping<CollectDatetimeObject | string>

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
  [P in RequiredKeysWrite<S>]: S[P]['multiple'] extends true ? Array<TypeMappingWrite[S[P]['type']]>
  : TypeMappingWrite[S[P]['type']]
} & {
  [P in OptionalKeysWrite<S>]?: S[P]['multiple'] extends true ?
    Array<TypeMappingWrite[S[P]['type']]>
  : TypeMappingWrite[S[P]['type']]
}
// --------------------------------------------

// Typings for read ops (find/findById/findOne)
type TypeMappingRead = TypeMapping<string>

type OptionalKeysRead<S extends CollectSchema = CollectSchema> = {
  [P in keyof S]: S[P]['required'] extends false ? P : never
}[keyof S]

type RequiredKeysRead<S extends CollectSchema = CollectSchema> = {
  [P in keyof S]: S[P]['required'] extends false ? never : P
}[keyof S]

export type InferSchemaTypesRead<S extends CollectSchema = CollectSchema> = {
  [P in RequiredKeysRead<S>]: S[P]['multiple'] extends true ? Array<TypeMappingRead[S[P]['type']]>
  : TypeMappingRead[S[P]['type']]
} & {
  [P in OptionalKeysRead<S>]?: S[P]['multiple'] extends true ? Array<TypeMappingRead[S[P]['type']]>
  : TypeMappingRead[S[P]['type']]
}
export type CollectInferType<T extends CollectModel<any> = CollectModel<any>> = FlattenTypes<
  InferSchemaTypesRead<T['schema']>
>
// --------------------------------------------

export type CollectRecordProps<T extends CollectSchema = CollectSchema> = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  [K in keyof T]?: T extends CollectSchema ? InferSchemaTypesRead<T>[K] : T[K]
}

export type CollectRecord<T extends CollectSchema = CollectSchema> = CollectRecordInternalProps<T> &
  CollectRecordProps<T>

export type CollectRelationTarget =
  | CollectRecordsArrayInstance<any>
  | MaybeArray<CollectRecord<any>>
  | MaybeArray<CollectRecordInstance<any>>
  | MaybeArray<string>
