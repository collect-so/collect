import type {
  CollectPropertyType,
  CollectPropertyValue,
  FlattenTypes,
  MaybePromise
} from '../types'

export type CollectSchemaDefaultValue = MaybePromise<CollectPropertyValue>

export type CollectSchema = Record<
  string,
  {
    default?: CollectSchemaDefaultValue
    multiple?: boolean
    required?: boolean
    type: CollectPropertyType
    uniq?: boolean
  }
>

export type CollectSDKResult<T extends (...args: any[]) => Promise<any>> = FlattenTypes<
  Awaited<ReturnType<T>>
>
