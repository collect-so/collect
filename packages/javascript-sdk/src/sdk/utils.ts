import type { CollectPropertyValue, CollectSchema, InferSchemaTypesWrite } from '../types/index.js'

import { UniquenessError } from './errors.js'

export const mergeDefaultsWithPayload = async <Schema extends CollectSchema = CollectSchema>(
  schema: Schema,
  payload: Partial<InferSchemaTypesWrite<Schema>>
): Promise<InferSchemaTypesWrite<Schema>> => {
  const defaultPromises = Object.entries(schema).map(async ([key, prop]) => {
    if (
      prop.default &&
      typeof prop.default !== 'undefined' &&
      typeof payload[key as keyof Partial<InferSchemaTypesWrite<Schema>>] === 'undefined'
    ) {
      return {
        key,
        value: typeof prop.default === 'function' ? await prop.default() : prop.default
      }
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

  return { ...defaults, ...payload } as InferSchemaTypesWrite<Schema>
}

export const pickUniqFieldsFromRecord = <Schema extends CollectSchema = CollectSchema>(
  schema: Schema,
  data: Partial<InferSchemaTypesWrite<Schema>>
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

export const pickUniqFieldsFromRecords = <Schema extends CollectSchema = CollectSchema>(
  data: Partial<InferSchemaTypesWrite<Schema>>[],
  schema: Schema,
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
