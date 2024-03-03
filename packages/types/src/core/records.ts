import type { Enumerable } from '../utils'
import type {
  CollectObject,
  CollectSchema,
  InferTypesFromSchema
} from './common'
import type { CollectPropertyType } from './properties'

export type CollectRecordInternalProps<
  T extends CollectObject | CollectSchema = CollectSchema
> = {
  _collect_id: string
  _collect_label?: string
  _collect_propsMetadata?: Record<keyof T, CollectPropertyType>
}

export type CollectRecordProps<
  T extends CollectObject | CollectSchema = CollectSchema
> = {
  [K in keyof T]?: T extends CollectSchema
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Enumerable<InferTypesFromSchema<T>[K]>
    : Enumerable<T[K]>
}

export type CollectRecord<
  T extends CollectObject | CollectSchema = CollectSchema
> = CollectRecordInternalProps<T> & CollectRecordProps<T>
