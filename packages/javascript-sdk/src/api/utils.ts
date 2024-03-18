import { CollectTransaction } from '../sdk/transaction'
import { isString } from '../utils/utils'

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
