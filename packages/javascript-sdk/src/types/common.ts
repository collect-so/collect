import type { CollectPropertyType } from './properties'
import type { FlattenTypes, MaybePromise } from './utils'
import type { CollectPropertyValue } from './value'

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

export type CollectApiResponse<T, E = Record<string, any>> = {
  data: T
  success: boolean
  total?: number
} & E

export type CollectSDKResult<T extends (...args: any[]) => Promise<any>> = FlattenTypes<
  Awaited<ReturnType<T>>
>
