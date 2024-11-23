import type { CollectPropertyValue, CollectSchema, InferSchemaTypesWrite } from '../types/index.js'
import type { UserProvidedConfig } from './types.js'

import { isObject } from '../common/utils.js'
import { ALLOWED_CONFIG_PROPERTIES } from './constants.js'
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

export const parseConfig = (config?: Record<string, unknown>): UserProvidedConfig => {
  if (!config) {
    return {} as UserProvidedConfig
  }

  if (!isObject(config)) {
    throw new Error('Config must be an object')
  }

  const values = Object.keys(config).filter((value) => !ALLOWED_CONFIG_PROPERTIES.includes(value))

  if (values.length > 0) {
    throw new Error(
      `Config object may only contain the following: ${ALLOWED_CONFIG_PROPERTIES.join(', ')}`
    )
  }

  return config as UserProvidedConfig
}

export function validateInteger(name: string, n: unknown, defaultVal?: number): number {
  if (!Number.isInteger(n)) {
    if (defaultVal !== undefined) {
      return defaultVal
    } else {
      throw new Error(`${name} must be an integer`)
    }
  }

  return n as number
}

export function idToTimestamp(id: string): number {
  const parts = id.split('-')
  const highBitsHex = parts[0] + parts[1].slice(0, 4)

  return parseInt(highBitsHex, 16)
}

export function idToDate(id: string): Date {
  return new Date(idToTimestamp(id))
}
