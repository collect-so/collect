import type { UserProvidedConfig } from '../types'

import {
  ALLOWED_CONFIG_PROPERTIES,
  DEFAULT_BASE_PATH,
  DEFAULT_HOST,
  DEFAULT_PORT,
  DEFAULT_PROTOCOL
} from './constants'

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
