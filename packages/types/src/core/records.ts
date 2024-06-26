// import type { Enumerable } from '../utils'
import type { CollectObject, CollectSchema, InferSchemaTypesRead } from './common'
import type { CollectPropertyType } from './properties'

export type CollectRecordInternalProps<T extends CollectObject | CollectSchema = CollectSchema> = {
  __id: string
  __label?: string
  __proptypes?: Record<keyof T, CollectPropertyType>
}

export type CollectRecordProps<T extends CollectObject | CollectSchema = CollectSchema> = {
  // [K in keyof T]?: T extends CollectSchema
  //   ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     Enumerable<InferTypesFromSchema<T>[K]>
  //   : Enumerable<T[K]>

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  [K in keyof T]?: T extends CollectSchema ? InferSchemaTypesRead<T>[K] : T[K]
}

export type CollectRecord<T extends CollectObject | CollectSchema = CollectSchema> =
  CollectRecordInternalProps<T> & CollectRecordProps<T>
