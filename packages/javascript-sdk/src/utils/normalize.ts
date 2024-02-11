import type {
  CollectPropertyType,
  CollectPropertyValue
} from '@collect.so/types'

import {
  ISO_8601_FULL,
  PROPERTY_TYPE_BOOLEAN,
  PROPERTY_TYPE_DATETIME,
  PROPERTY_TYPE_NULL,
  PROPERTY_TYPE_NUMBER,
  PROPERTY_TYPE_STRING
} from '../common/constants'

export const arrayIsConsistent = (arr: Array<unknown>) => {
  if (arr.length === 0) {
    return true
  }

  const firstElementType = typeof arr[0]

  for (let i = 1; i < arr.length; i++) {
    if (typeof arr[i] !== firstElementType) {
      return false
    }
  }

  return true
}

export const getValueParameters = (value: CollectPropertyValue) => {
  if (Array.isArray(value)) {
    const isInconsistentArray = !arrayIsConsistent(value)
    const isEmptyArray =
      !value.length || value.every((v) => typeof v === 'undefined')
    const isEmptyStringsArray = value.every((v) => v === '')

    return {
      isEmptyArray,
      isEmptyStringsArray,
      isInconsistentArray
    }
  } else {
    const isEmptyString = value === ''

    return {
      isEmptyString
    }
  }
}

export const suggestPropertyType = (
  value: CollectPropertyValue
): CollectPropertyType => {
  if (typeof value === 'string') {
    return ISO_8601_FULL.test(value)
      ? PROPERTY_TYPE_DATETIME
      : PROPERTY_TYPE_STRING
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

export const normalizeRecord = ({
  label,
  options,
  parentId,
  payload
}: {
  label?: string
  options: {
    suggestTypes: boolean
  }
  parentId?: string
  payload: Record<string, CollectPropertyValue>
}) => {
  return {
    label,
    parentId,
    properties: Object.keys(payload).reduce<
      Array<{
        name: string
        type?: CollectPropertyType
        value?: CollectPropertyValue
      }>
    >((acc, name) => {
      const property: {
        name: string
        type?: CollectPropertyType
        value?: CollectPropertyValue
      } = {
        name
      }
      const value = payload[name]
      const valueParameters = getValueParameters(value)

      if (Array.isArray(value)) {
        if (options.suggestTypes) {
          const { isEmptyArray, isInconsistentArray } = valueParameters

          // @TODO: Refactor this messy shit out
          // Always fallback to STRING type if array of values is inconsistent
          property.value = isEmptyArray
            ? [''] // @TODO: Figure out how to store empty array without '' as value. Now it returns as "" instead of []
            : isInconsistentArray
            ? value.map(String)
            : value

          property.type = isInconsistentArray
            ? PROPERTY_TYPE_STRING
            : suggestPropertyType(value[0])
        } else {
          property.value = value.map(String)
          property.type = PROPERTY_TYPE_STRING
        }
      } else {
        if (options.suggestTypes) {
          const valueType = suggestPropertyType(value)

          property.value = valueType === PROPERTY_TYPE_NULL ? null : value
          property.type = valueType
        } else {
          property.value = String(value)
          property.type = PROPERTY_TYPE_STRING
        }
      }
      return [...acc, property]
    }, [])
  }
}
