/* eslint-disable prefer-rest-params */
import type { CollectQuery } from '@collect.so/types'

import type { CollectRestAPI } from '../types.js'
import type { Label } from '../types/types.js'

import { extractLabelAndParams } from '../utils/utils.js'

// type CreateResult = Omit<Result, 'update'> & {
//   update(searchParams: CollectQuery, payload: RecordPayload): Promise<Result>
// }

// TODO: refactor
// const createProxy = (
//   newResult: Result,
//   labelOrModelOrPayload: LabelOrModelOrPayload
// ) => {
//   return new Proxy(newResult, {
//     get(_, prop) {
//       if (prop === 'update' && isLabelOrModel(labelOrModelOrPayload)) {
//         return (...args: any[]) =>
//           // @ts-expect-error A spread argument must either have a tuple type or be passed to a rest parameter.
//           newResult.update(labelOrModelOrPayload, ...args)
//       }
//       // @ts-expect-error A spread argument must either have a tuple type or be passed to a rest parameter.
//       return Reflect.get(...arguments)
//     }
//   })
// }

export class Result<T extends object = object> {
  readonly data: T
  readonly api: CollectRestAPI
  constructor(
    api: CollectRestAPI, 
    data?: T) {
    this.data = data as T
    this.api = api
  }

  // async create(payload: RecordPayload): Promise<CreateResult>
  // async create(
  //   labelOrModel: LabelOrModel,
  //   payload: RecordPayload
  // ): Promise<CreateResult>
  // async create(
  //   labelOrModelOrPayload: LabelOrModelOrPayload,
  //   payload?: RecordPayload
  // ): Promise<CreateResult> {
  //   // await this.api.validate(labelOrModelOrPayload, payload)
  //
  //   const body = createBody(labelOrModelOrPayload, payload)
  //   const data = await this.api?.createRecord(body)
  //
  //   return createProxy(new Result(this.api, data), labelOrModelOrPayload)
  // }

  // async update(
  //   searchParams: CollectQuery,
  //   payload: RecordPayload
  // ): Promise<Result>
  // async update(
  //   labelOrModel: LabelOrModel,
  //   searchParams: CollectQuery,
  //   payload: RecordPayload
  // ): Promise<Result>
  // async update(
  //   labelOrModelOrParams: CollectQuery | LabelOrModel,
  //   searchParamsOrPayload: CollectQuery | RecordPayload,
  //   payload?: RecordPayload
  // ) {
  //   let params: CollectQuery
  //   let body: AnyObject
  //
  //   if (isLabelOrModel(labelOrModelOrParams)) {
  //     // await this.collectInstance.validate(labelOrModelOrParams, payload)
  //     body = createBody(labelOrModelOrParams, payload)
  //     params = searchParamsOrPayload as CollectQuery
  //   } else {
  //     params = labelOrModelOrParams
  //     body = searchParamsOrPayload
  //   }
  //
  //   const data = await this.api?.updateRecordWithSearchParams(params, body)
  //
  //   return new Result(this.api, data)
  // }



  // async delete(searchParams: CollectQuery): Promise<Result>
  // async delete(label: Label, searchParams?: CollectQuery): Promise<Result>
  // async delete(
  //   labelOrSearchParams: CollectQuery | Label,
  //   searchParams?: CollectQuery
  // ): Promise<Result> {
  //   const { label, params } = extractLabelAndParams(
  //     labelOrSearchParams,
  //     searchParams
  //   )
  //
  //   const data = await this.api?.deleteRecords(params, label)
  //
  //   return new Result(this.api, data)
  // }

  // async link(
  //   targetOrSearchParams: AnyResult | AnyResult[] | CollectQuery,
  //   metadata?: AnyObject
  // ) {
  //   let originId: RecordId | undefined
  //   let params: AnyObject & { targetIds?: RecordId[] } = {}
  //
  //   if (isResultWithId(this)) {
  //     originId = this.data['id'] as string
  //   } else {
  //     throw new Error('cannot be called on an empty object')
  //   }
  //
  //   if (Array.isArray(targetOrSearchParams)) {
  //     params['targetIds'] = []
  //     for (let target of targetOrSearchParams) {
  //       if (isResultWithId(target)) {
  //         params['targetIds'].push(target.data['id'])
  //       }
  //     }
  //   } else if (targetOrSearchParams instanceof Result) {
  //     if (isResultWithId(targetOrSearchParams)) {
  //       params.targetIds = []
  //       params.targetIds.push(targetOrSearchParams.data.id)
  //     }
  //   } else {
  //     params = targetOrSearchParams
  //   }
  //
  //   await this.api?.linkRecords(originId, params, metadata)
  //
  //   return this
  // }
}
