import type { UserProvidedConfig } from '../sdk/types.js'
import type {
  CollectPropertyType,
  CollectPropertyValue,
  CollectPropertyWithValue,
  CollectQuery,
  CollectSchema
} from '../types/index.js'

import {
  ISO_8601_FULL,
  PROPERTY_TYPE_BOOLEAN,
  PROPERTY_TYPE_DATETIME,
  PROPERTY_TYPE_NULL,
  PROPERTY_TYPE_NUMBER,
  PROPERTY_TYPE_STRING
} from '../common/constants.js'
import { isArray, isObject, isString } from '../common/utils.js'
import { CollectTransaction } from '../sdk/transaction.js'
import { DEFAULT_BASE_PATH, DEFAULT_HOST, DEFAULT_PORT, DEFAULT_PROTOCOL } from './constants.js'

export const buildTransactionHeader = (txId?: string) =>
  txId ?
    {
      ['x-transaction-id']: txId
    }
  : undefined

export const isTransaction = (input: any): input is CollectTransaction | string =>
  isString(input) || input instanceof CollectTransaction

export const pickTransaction = (input: any) => (isTransaction(input) ? input : undefined)

export const pickTransactionId = (input: any) =>
  isTransaction(input) ?
    input instanceof CollectTransaction ?
      input.id
    : input
  : undefined

export const createSearchParams = <Schema extends CollectSchema = CollectSchema>(
  labelOrSearchParams?: CollectQuery<Schema> | string,
  searchParamsOrTransaction?: CollectQuery<Schema> | CollectTransaction | string
): { id?: string; searchParams: CollectQuery<Schema> } => {
  const isFirstArgString = isString(labelOrSearchParams)
  const isFirstArgUUID = isUUID(labelOrSearchParams)
  const isSecondArgTransaction = isTransaction(searchParamsOrTransaction)
  const isEmptySearchParams = isSecondArgTransaction || !isObject(searchParamsOrTransaction)

  if (isFirstArgString) {
    const baseParams =
      isFirstArgUUID ?
        { id: labelOrSearchParams }
      : { searchParams: { labels: [labelOrSearchParams as string] } as CollectQuery<Schema> }

    return isEmptySearchParams ?
        { ...baseParams, searchParams: { ...baseParams.searchParams } }
      : {
          ...baseParams,
          searchParams: {
            ...searchParamsOrTransaction,
            labels: [
              ...(baseParams.searchParams?.labels ?? []),
              ...((searchParamsOrTransaction as CollectQuery<Schema>).labels ?? [])
            ]
          }
        }
  } else {
    return { searchParams: labelOrSearchParams ?? {} }
  }
}

export const isUUID = (value: any) => {
  const regex =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
  return regex.test(value)
}

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
  if (typeof value === PROPERTY_TYPE_STRING) {
    return ISO_8601_FULL.test(value as string) ? PROPERTY_TYPE_DATETIME : PROPERTY_TYPE_STRING
  } else if (typeof value === PROPERTY_TYPE_NUMBER) {
    return PROPERTY_TYPE_NUMBER
  } else if (typeof value === PROPERTY_TYPE_BOOLEAN) {
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
    protocol = props.protocol.replace(':', '')
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
