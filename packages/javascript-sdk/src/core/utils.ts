import type {
  AnyObject,
  Label,
  LabelOrModelOrPayload,
  PropertyType,
  RecordPayload,
  SearchParams
} from '../types'

import { isLabel } from '../types'
import { ISO_8601_FULL } from './constants'

const suggestType = (value: unknown): PropertyType => {
  if (typeof value === 'string' && value !== '') {
    if (ISO_8601_FULL.test(value)) {
      return 'datetime'
    }
    if (!isNaN(Number(value))) {
      return 'number'
    }
    return 'string'
  } else if (typeof value === 'boolean') {
    return 'boolean'
  } else if (typeof value === 'number') {
    return 'number'
  } else if (Array.isArray(value)) {
    if (value.every((value) => suggestType(value) === 'datetime'))
      return 'datetime'
    if (value.every((value) => suggestType(value) === 'number')) return 'number'
    if (value.every((value) => suggestType(value) === 'boolean'))
      return 'boolean'
    return 'string'
  } else {
    return 'string'
  }
}

export const normalizeData = (rawData: RecordPayload) => {
  if (Array.isArray(rawData)) {
    return rawData.map((property) => {
      const normalizedProperty = { ...property }

      if (!Object.prototype.hasOwnProperty.call(property, 'type')) {
        normalizedProperty.type = suggestType(property.value)
      }
      return normalizedProperty
    })
  } else {
    return Object.keys(rawData).map((name) => ({
      name,
      type: suggestType(rawData[name]),
      value: rawData[name]
    }))
  }
}

export const createBody = (
  labelOrModelOrPayload: LabelOrModelOrPayload,
  payload?: RecordPayload
) => {
  let body: AnyObject = {}

  if (payload) {
    if (isLabel(labelOrModelOrPayload)) {
      body['label'] = labelOrModelOrPayload
    }
    body['properties'] = normalizeData(payload)
  } else {
    body['properties'] = normalizeData(labelOrModelOrPayload as AnyObject)
  }

  return body
}

export const extractLabelAndParams = (
  labelOrSearchParams: Label | SearchParams,
  searchParams?: SearchParams
) => {
  let label
  let params = {}

  if (typeof searchParams !== 'undefined' && isLabel(labelOrSearchParams)) {
    label = labelOrSearchParams
    params = searchParams
  } else {
    params = labelOrSearchParams
  }

  return { label, params } as const
}
