import type {
  CollectObject,
  CollectSchema,
  FlattenTypes
} from '@collect.so/types'

import type { HttpClientInterface } from '../network/HttpClient'
import type { Validator } from '../validators/types'

export type CollectState = {
  debug: boolean
  timeout: number
  token: string
}

type CommonUserProvidedConfig = {
  httpClient?: HttpClientInterface
  timeout?: number
  validator?: Validator
}
export type UserProvidedConfig =
  | (CommonUserProvidedConfig & {
      host: string
      port: number
      protocol: string
    })
  | (CommonUserProvidedConfig & {
      url: string
    })

export type CollectSDKResult<T extends (...args: any[]) => Promise<any>> =
  FlattenTypes<Awaited<ReturnType<T>>>

// export type CollectModel<
//   T extends CollectObject | CollectSchema = CollectSchema
// > = {
//   _label?: string
//   create: (data: T) => Promise<CollectRecord<T>>
//   delete: (id: string) => Promise<CollectRecord<T>>
//   update: (id: string, data: Partial<T>) => Promise<CollectRecord<T>>
// }
