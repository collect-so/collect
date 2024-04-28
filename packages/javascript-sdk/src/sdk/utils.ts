import type {
  AnyObject,
  CollectPropertyType,
  CollectPropertyValue,
  CollectPropertyWithValue,
  CollectSchema,
  Enumerable,
  InferSchemaTypesWrite
} from '../types'

import { UniquenessError } from './errors'

export class CollectBatchDraft {
  label?: string
  options?: {
    generateLabels?: boolean
    returnResult?: boolean
    suggestTypes?: boolean
  }
  parentId?: string
  payload: Enumerable<AnyObject>

  constructor({
    label,
    options = {
      generateLabels: true,
      returnResult: true,
      suggestTypes: true
    },
    parentId,
    payload
  }: {
    label?: string
    options?: {
      generateLabels?: boolean
      returnResult?: boolean
      suggestTypes?: boolean
    }
    parentId?: string
    payload: AnyObject
  }) {
    this.label = label
    this.options = options
    this.parentId = parentId
    this.payload = payload
  }

  public toJson() {
    return {
      label: this.label,
      options: this.options,
      parentId: this.parentId,
      payload: this.payload
    }
  }
}

export class CollectRecordDraft {
  label?: string
  parentId?: string
  properties?: Array<{
    metadata?: string
    name: string
    type: CollectPropertyType
    value: CollectPropertyValue
    valueMetadata?: string
    valueSeparator?: string
  }>

  constructor({
    label,
    parentId,
    properties = []
  }: {
    label?: string
    parentId?: string
    properties?: Array<
      CollectPropertyWithValue & {
        metadata?: string
        valueMetadata?: string
        valueSeparator?: string
      }
    >
  }) {
    this.label = label
    this.parentId = parentId
    this.properties = properties
  }

  public toJson() {
    return {
      label: this.label,
      parentId: this.parentId,
      properties: this.properties
    }
  }
}

export const mergeDefaultsWithPayload = async <T extends CollectSchema = CollectSchema>(
  schema: T,
  payload: Partial<InferSchemaTypesWrite<T>>
): Promise<InferSchemaTypesWrite<T>> => {
  const defaultPromises = Object.entries(schema).map(async ([key, prop]) => {
    if (
      prop.default &&
      typeof prop.default === 'function' &&
      typeof payload[key as keyof Partial<InferSchemaTypesWrite<T>>] === 'undefined'
    ) {
      return { key, value: await prop.default() }
    } else {
      return { key, value: undefined }
    }
  })

  const resolvedDefaults = await Promise.all(defaultPromises)

  const defaults = resolvedDefaults.reduce(
    (acc, { key, value }) => {
      if (value !== undefined) {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, CollectPropertyValue>
  )

  return { ...defaults, ...payload } as InferSchemaTypesWrite<T>
}

export const pickUniqFieldsFromRecord = <T extends CollectSchema = CollectSchema>(
  schema: T,
  data: Partial<InferSchemaTypesWrite<T>>
) => {
  return Object.entries(data)
    .filter(([key]) => schema[key]?.uniq)
    .reduce(
      (acc, [key, value]) => {
        if (key in schema) {
          acc[key] = value as CollectPropertyValue
        }
        return acc
      },
      {} as Record<string, CollectPropertyValue>
    )
}

export const pickUniqFieldsFromRecords = <T extends CollectSchema = CollectSchema>(
  data: Partial<InferSchemaTypesWrite<T>>[],
  schema: T,
  label: string
) => {
  const properties = {} as Record<string, CollectPropertyValue[]>

  const uniqFields = Object.entries(schema)
    .filter(([_, config]) => config.uniq)
    .reduce(
      (acc, [key]) => {
        acc[key] = true

        return acc
      },
      {} as Record<string, boolean>
    )

  data.forEach((record) => {
    Object.entries(record).forEach(([key, value]) => {
      if (key in uniqFields) {
        if (properties[key]) {
          if (properties[key].includes(value as CollectPropertyValue)) {
            throw new UniquenessError(label, { [key]: value })
          }
          properties[key] = [...properties[key], value] as CollectPropertyValue[]
        } else {
          properties[key] = [value] as CollectPropertyValue[]
        }
      }
    })
  })

  return properties
}
