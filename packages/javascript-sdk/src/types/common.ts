import type { FlattenTypes, MaybePromise } from './utils'
import type { CollectPropertyType, CollectPropertyValue } from './value'

export type CollectSchemaDefaultValue<T extends CollectPropertyType = CollectPropertyType> =
  | CollectPropertyValue<T>
  | MaybePromise<CollectPropertyValue<T>>

export type CollectSchemaField<T extends CollectPropertyType = CollectPropertyType> = {
  default?: CollectSchemaDefaultValue<T>
  multiple?: boolean
  required?: boolean
  type: T
  uniq?: boolean
}

export type CollectSchema = Record<string, CollectSchemaField>

export type CollectSDKResult<T extends (...args: any[]) => Promise<any>> = FlattenTypes<
  Awaited<ReturnType<T>>
>
