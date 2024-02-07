import type { CollectPropertyType, CollectQuery } from '@collect.so/types'

import type { UserProvidedConfig } from '../../sdk/types'

import {
  ALLOWED_CONFIG_PROPERTIES,
  DEFAULT_BASE_PATH,
  DEFAULT_HOST,
  DEFAULT_PORT,
  DEFAULT_PROTOCOL,
  ISO_8601_FULL
} from '../constants'

const suggestType = (value: unknown): CollectPropertyType => {
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

export const normalizeData = <T extends object = object>(rawData: T) => {
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      type: suggestType(rawData[name]),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      value: rawData[name]
    }))
  }
}

// export const createBody = <T extends object = object>(
//   labelOrModelOrPayload: string,
//   payload?: RecordPayload
// ) => {
//   let body = {
//     label: '',
//     properties: []
//   }
//
//   if (payload) {
//     if (typeof labelOrModelOrPayload === 'string') {
//       body['label'] = labelOrModelOrPayload
//     }
//     body['properties'] = normalizeData(payload)
//   } else {
//     body['properties'] = normalizeData(labelOrModelOrPayload)
//   }
//
//   return body
// }

export const extractLabelAndParams = <T extends object = object>(
  labelOrSearchParams: CollectQuery<T> | string,
  searchParams?: CollectQuery<T>
): { label: string; params: CollectQuery<T> } => {
  let label = ''
  let params: CollectQuery<T>

  if (
    typeof searchParams !== 'undefined' &&
    typeof labelOrSearchParams === 'string'
  ) {
    label = labelOrSearchParams
    params = searchParams
  } else {
    params = labelOrSearchParams as CollectQuery<T>
  }

  return { label, params } as { label: string; params: CollectQuery<T> }
}

export function validateInteger(
  name: string,
  n: unknown,
  defaultVal?: number
): number {
  if (!Number.isInteger(n)) {
    if (defaultVal !== undefined) {
      return defaultVal
    } else {
      throw new Error(`${name} must be an integer`)
    }
  }

  return n as number
}

export const buildUrl = (props: UserProvidedConfig): string => {
  let protocol = DEFAULT_PROTOCOL
  let host = DEFAULT_HOST
  let port = DEFAULT_PORT
  let basePath = DEFAULT_BASE_PATH

  if ('url' in props) {
    const url = new URL(props.url)
    protocol = url.protocol.replace(':', '')
    host = url.hostname
    port = parseInt(
      url.port || protocol === 'http' ? '80' : protocol === 'https' ? '443' : ''
    )
  }

  if ('host' in props && 'port' in props && 'protocol' in props) {
    protocol = props.protocol
    host = props.host
    port = props.port
  }

  // Ensure the basePath starts with a '/'
  if (basePath && !basePath.startsWith('/')) {
    basePath = '/' + basePath
  }

  // If the port is the default for the protocol (80 for http, 443 for https), it can be omitted
  let portString = ''
  if (
    !(
      (protocol === 'http' && port === 80) ||
      (protocol === 'https' && port === 443)
    )
  ) {
    portString = ':' + port
  }

  return `${protocol}://${host}${portString}${basePath}`
}
export const parseConfig = (
  config?: Record<string, unknown>
): UserProvidedConfig => {
  // If config is null or undefined, just bail early with no props
  if (!config) {
    return {} as UserProvidedConfig
  }

  const isObject = config === Object(config) && !Array.isArray(config)

  if (!isObject) {
    throw new Error('Config must be an object')
  }

  const values = Object.keys(config).filter(
    (value) => !ALLOWED_CONFIG_PROPERTIES.includes(value)
  )

  if (values.length > 0) {
    throw new Error(
      `Config object may only contain the following: ${ALLOWED_CONFIG_PROPERTIES.join(
        ', '
      )}`
    )
  }

  return config as UserProvidedConfig
}
