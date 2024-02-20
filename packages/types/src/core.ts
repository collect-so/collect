import type { CollectPropertyType } from './entities'

export type CollectModel<T extends CollectObject = CollectObject> = {
  _label?: string
  create: (data: T) => Promise<CollectRecord<T>>
  delete: (id: string) => Promise<CollectRecord<T>>
  update: (id: string, data: Partial<T>) => Promise<CollectRecord<T>>
}

export type CollectObject = Record<
  string,
  boolean | null | number | string | undefined
>

export type CollectRecord<T extends CollectObject = CollectObject> = T

export type CollectDateTimeObject = {
  day?: number
  hour?: number
  microsecond?: number
  millisecond?: number
  minute?: number
  month?: number
  nanosecond?: number
  second?: number
  year: number
}

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
  datetime: CollectDateTimeObject | string
  null: null
  number: number
  string: string
}

type OptionalKeys<S extends CollectSchema = CollectSchema> = {
  [P in keyof S]: S[P]['required'] extends false ? P : never
}[keyof S]

type RequiredKeys<S extends CollectSchema = CollectSchema> = {
  [P in keyof S]: S[P]['required'] extends false ? never : P
}[keyof S]

export type InferSchemaType<S extends CollectSchema = CollectSchema> = {
  [P in RequiredKeys<S>]: TypeMapping[S[P]['type']]
} & {
  [P in OptionalKeys<S>]?: TypeMapping[S[P]['type']]
}
