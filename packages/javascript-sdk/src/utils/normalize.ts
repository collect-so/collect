import type { CollectPropertyType, CollectPropertyValue, CollectPropertyWithValue } from '../types'

import {
  ISO_8601_FULL,
  PROPERTY_TYPE_BOOLEAN,
  PROPERTY_TYPE_DATETIME,
  PROPERTY_TYPE_NULL,
  PROPERTY_TYPE_NUMBER,
  PROPERTY_TYPE_STRING
} from '../common/constants'
import { isArray } from './utils'

export const arrayIsConsistent = (arr: Array<unknown>): boolean =>
  arr.every((item) => typeof item === typeof arr[0])

export const getValueParameters = (value: CollectPropertyValue) => {
  if (Array.isArray(value)) {
    return {
      isEmptyArray: value.length === 0,
      isEmptyStringsArray: value.every((v) => v === ''),
      isInconsistentArray: !arrayIsConsistent(value)
    }
  } else {
    return { isEmptyString: value === '' }
  }
}

export const suggestPropertyType = (value: CollectPropertyValue): CollectPropertyType => {
  if (typeof value === 'string') {
    return ISO_8601_FULL.test(value) ? PROPERTY_TYPE_DATETIME : PROPERTY_TYPE_STRING
  } else if (typeof value === 'number') {
    return PROPERTY_TYPE_NUMBER
  } else if (typeof value === 'boolean') {
    return PROPERTY_TYPE_BOOLEAN
  } else if (value === null) {
    return PROPERTY_TYPE_NULL
  } else {
    return PROPERTY_TYPE_STRING
  }
}

const processArrayValue = (value: any[], suggestTypes: boolean) => {
  const { isEmptyArray, isInconsistentArray } = getValueParameters(value)
  if (isEmptyArray) {
    return { type: PROPERTY_TYPE_STRING, value: [] }
  }
  if (isInconsistentArray || !suggestTypes) {
    return { type: PROPERTY_TYPE_STRING, value: value.map(String) }
  }
  return { type: suggestPropertyType(value[0]), value }
}

const processNonArrayValue = (value: CollectPropertyValue, suggestTypes: boolean) => {
  if (!suggestTypes) {
    return { type: PROPERTY_TYPE_STRING, value: String(value) }
  }
  const type = suggestPropertyType(value)
  return { type, value: type === PROPERTY_TYPE_NULL ? null : value }
}

export const normalizeRecord = ({
  label,
  options = { suggestTypes: true },
  payload
}: {
  label?: string
  options?: { suggestTypes: boolean }
  parentId?: string
  payload: Record<string, CollectPropertyValue>
}) => ({
  label,
  properties: Object.entries(payload).map(([name, value]) => {
    const { type, value: processedValue } =
      isArray(value) ?
        processArrayValue(value, options.suggestTypes)
      : processNonArrayValue(value, options.suggestTypes)

    return { name, type, value: processedValue }
  }) as CollectPropertyWithValue[]
})
