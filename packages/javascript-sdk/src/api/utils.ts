import type { CollectObject, CollectQuery } from '@collect.so/types'

import { CollectTransaction } from '../sdk/transaction'
import { isObject, isString } from '../utils/utils'

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

export const createSearchParams = <T extends CollectObject>(
  labelOrSearchParams?: CollectQuery<T> | string,
  searchParamsOrTransaction?: CollectQuery<T> | CollectTransaction | string
): { id?: string; searchParams: CollectQuery<T> } => {
  const isFirstArgString = isString(labelOrSearchParams)
  const isFirstArgUUID = isUUID(labelOrSearchParams)
  const isSecondArgTransaction = isTransaction(searchParamsOrTransaction)
  const hasNoSearchParams = isSecondArgTransaction || !isObject(searchParamsOrTransaction)

  if (isFirstArgString) {
    const baseParams =
      isFirstArgUUID ?
        { id: labelOrSearchParams }
      : { searchParams: { labels: [labelOrSearchParams as string] } as CollectQuery<T> }

    return hasNoSearchParams ?
        { ...baseParams, searchParams: {} }
      : {
          ...baseParams,
          searchParams: {
            ...searchParamsOrTransaction,
            labels: [
              ...(baseParams.searchParams?.labels ?? []),
              ...((searchParamsOrTransaction as CollectQuery<T>).labels ?? [])
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
