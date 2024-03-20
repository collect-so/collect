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
): CollectQuery<T> => {
  const isFirstArgLabel = isString(labelOrSearchParams)
  const isSecondArgTransaction = isTransaction(searchParamsOrTransaction)

  if (isFirstArgLabel) {
    const baseParams = { labels: [labelOrSearchParams as string] }
    return isSecondArgTransaction || !isObject(searchParamsOrTransaction) ?
        baseParams
      : {
          ...searchParamsOrTransaction,
          labels: [
            ...((searchParamsOrTransaction as CollectQuery<T>).labels ?? []),
            labelOrSearchParams as string
          ]
        }
  } else {
    return (labelOrSearchParams ?? {}) as CollectQuery<T>
  }
}
