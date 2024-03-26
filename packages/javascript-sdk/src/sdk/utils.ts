import type {
  AnyObject,
  CollectObject,
  CollectPropertyType,
  CollectPropertyValue,
  CollectPropertyWithValue,
  CollectSchema,
  Enumerable,
  InferTypesFromSchema
} from '@collect.so/types'

import { UniquenessError } from './errors'

export class CollectImportRecordsObject {
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

export class CollectRecordObject {
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
  payload: Partial<InferTypesFromSchema<T>>
): Promise<InferTypesFromSchema<T>> => {
  const defaultPromises = Object.entries(schema).map(async ([key, prop]) => {
    if (
      prop.default &&
      typeof prop.default === 'function' &&
      typeof payload[key as keyof Partial<InferTypesFromSchema<T>>] === 'undefined'
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

  return { ...defaults, ...payload } as InferTypesFromSchema<T>
}

export const pickUniqFields = <T extends CollectSchema = CollectSchema>(
  schema: T,
  data: Partial<InferTypesFromSchema<T>>
) => {
  return Object.entries(data)
    .filter(([key, value]) => schema[key]?.uniq)
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

export const checkForInternalDuplicates = <T extends CollectSchema = CollectSchema>(
  records: InferTypesFromSchema<T>[],
  schema: T,
  label: string
) => {
  const uniqueSignatures = new Set<string>()

  records.forEach((record) => {
    const signature = Object.entries(schema)
      .filter(([key, value]) => value.uniq)
      .map(([key]) => `${key}:${(record as any)[key]}`)
      .sort()
      .join('|')

    if (uniqueSignatures.has(signature)) {
      throw new UniquenessError(label, signature)
    }

    uniqueSignatures.add(signature)
  })
}
