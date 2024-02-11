import type { CollectPropertyType, FlattenTypes } from '@collect.so/types'

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

// export type InferSchemaType<S extends CollectSchema = CollectSchema> = {
//   [P in keyof S]: S[P]['type'] extends keyof TypeMapping
//     ? TypeMapping[S[P]['type']]
//     : never
// }

export type CollectSchema = Record<
  string,
  {
    required?: boolean
    type: CollectPropertyType
  }
>

export type CollectRelations = Record<
  string,
  {
    direction: 'in' | 'out'
    modelName: string
    type: string
  }
>

type TypeMapping = {
  boolean: boolean
  datetime: string
  null: null
  number: number
  string: string
}
export type InferSchemaType<S extends CollectSchema = CollectSchema> = {
  [P in keyof S]: S[P]['required'] extends false
    ? S[P]['type'] extends keyof TypeMapping
      ? TypeMapping[S[P]['type']] | undefined
      : never
    : S[P]['type'] extends keyof TypeMapping
    ? TypeMapping[S[P]['type']]
    : never
}

export type CollectSDKResult<T extends (...args: any[]) => Promise<any>> =
  FlattenTypes<Awaited<ReturnType<T>>>
