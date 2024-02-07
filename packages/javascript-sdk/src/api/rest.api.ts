import type { CollectQuery } from '@collect.so/types'

import type { HttpClient } from '../network/HttpClient'
import type { UserProvidedConfig } from '../sdk/types'

import { buildUrl, extractLabelAndParams } from '../common/utils/utils'
import { createFetcher } from '../network'
import { CollectResult } from '../sdk/result'
import { createApi } from './api'

export class CollectRestAPI {
  public api: ReturnType<typeof createApi>
  public fetcher: ReturnType<typeof createFetcher>

  constructor(
    token?: string,
    config?: UserProvidedConfig & { httpClient: HttpClient }
  ) {
    this.fetcher = null as unknown as ReturnType<typeof createFetcher>

    if (token && config?.httpClient) {
      const url = buildUrl(config) // Assuming buildUrl is a utility function
      this.fetcher = createFetcher({
        httpClient: config.httpClient,
        token,
        url
      })
    }
    this.api = createApi(this.fetcher)
  }

  public async find<T extends object = object>(
    searchParams?: CollectQuery<T>
  ): Promise<CollectResult<T[]>>
  public async find<T extends object = object>(
    label?: string,
    searchParams?: CollectQuery<T>
  ): Promise<CollectResult<T[]>>
  public async find<T extends object = object>(
    label?: CollectQuery<T> | string,
    searchParams?: CollectQuery<T>
  ): Promise<CollectResult<T[]>> {
    const { params } = extractLabelAndParams<T>(
      label as CollectQuery<T> | string,
      searchParams
    )

    const data = await this.api?.findRecords<T>(params)

    // Create a CollectResult instance and initialize it with the API
    const result = new CollectResult<T[]>(
      data.data,
      searchParams as CollectQuery<T[]>
    )
    result.init(this)

    return result
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
