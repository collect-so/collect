import type { FlattenTypes, MaybePromise } from './utils'
import type { CollectPropertyType, CollectPropertyValue } from './value'

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
