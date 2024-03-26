import type { UserProvidedConfig } from '../sdk/types'

import {
  ALLOWED_CONFIG_PROPERTIES,
  DEFAULT_BASE_PATH,
  DEFAULT_HOST,
  DEFAULT_PORT,
  DEFAULT_PROTOCOL
} from '../common/constants'

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
      url.port || protocol === 'http' ? '80'
      : protocol === 'https' ? '443'
      : ''
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
  if (!((protocol === 'http' && port === 80) || (protocol === 'https' && port === 443))) {
    portString = ':' + port
  }

  return `${protocol}://${host}${portString}${basePath}`
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

export const isArray = (item: any): item is any[] =>
  typeof item === 'object' && Array.isArray(item) && item !== null

export const isObject = (input: unknown): input is object =>
  input !== null && Object.prototype.toString.call(input) === '[object Object]'

export const isEmptyObject = (input: unknown): boolean =>
  isObject(input) && Object.keys(input).length === 0

export const isObjectFlat = (input: any): input is object => {
  return (
    isObject(input) &&
    Object.keys(input).every((key) => {
      const value = (input as Record<string, any>)[key]
      // Check if the value is an array
      if (Array.isArray(value)) {
        // Check if every element in the array is of an allowed type (string, number, boolean, or null)
        return value.every(
          (element) =>
            typeof element === 'string' ||
            typeof element === 'number' ||
            typeof element === 'boolean' ||
            element === null
        )
      }
      // Check if the value is a non-null object (excluding arrays, which are also typeof 'object')
      return !(value && typeof value === 'object')
    })
  )
}

export const isString = (input: any): input is string => typeof input === 'string'
