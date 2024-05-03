import type { CollectPropertyValue } from './value'

export type CollectPropertyType = 'boolean' | 'datetime' | 'null' | 'number' | 'string'

export type CollectProperty = {
  id: string
  metadata?: string
  name: string
  type: CollectPropertyType
}

export type CollectPropertyWithValue = CollectProperty & {
  value: CollectPropertyValue
}

export type CollectPropertyValuesData = {
  max?: number
  min?: number
  values: CollectPropertyValue[]
}
