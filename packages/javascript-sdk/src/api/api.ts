import type {
  CollectObject,
  CollectPropertyValue,
  CollectQuery
} from '@collect.so/types'

import type { HttpClient } from '../network/HttpClient'
import type { UserProvidedConfig } from '../sdk/types'

import { createFetcher } from '../network'
import { CollectResult } from '../sdk/result'
import { CollectArrayResult } from '../sdk/result'
import { normalizeRecord } from '../utils/normalize'
import {
  buildUrl,
  extractLabelAndParams,
  isArray,
  isObject,
  isObjectFlat
} from '../utils/utils'
import { createApi } from './create-api'
import { CollectImportRecordsObject, CollectRecordObject } from './utils'

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

  public async find<T extends CollectObject = CollectObject>(
    searchParams?: CollectQuery<T>
  ): Promise<CollectArrayResult<T>>
  public async find<T extends CollectObject = CollectObject>(
    label?: string,
    searchParams?: CollectQuery<T>
  ): Promise<CollectArrayResult<T>>
  public async find<T extends CollectObject = CollectObject>(
    label?: CollectQuery<T> | string,
    searchParams?: CollectQuery<T>
  ): Promise<CollectArrayResult<T>> {
    const { params } = extractLabelAndParams<T>(
      label as CollectQuery<T> | string,
      searchParams
    )

    const response = await this.api?.records.find<T>(params)

    // Wrap a CollectResult instance and initialize it with the API
    const result = new CollectArrayResult<T>(
      response.data,
      searchParams as CollectQuery<T>
    )
    // Expose API methods to result descendants
    result.init(this)

    return result
  }

  async create<T extends CollectObject = CollectObject>(
    data: CollectRecordObject | T
  ): Promise<CollectResult<T>>
  async create<T extends CollectObject = CollectObject>(
    label: string,
    data?: CollectRecordObject | T
  ): Promise<CollectResult<T>>
  async create<T extends CollectObject = CollectObject>(
    labelOrData: CollectRecordObject | T | string,
    maybeData?: CollectRecordObject | T
  ) {
    let response

    if (labelOrData instanceof CollectRecordObject) {
      response = await this.api?.records.create<T>(labelOrData)
    }

    if (typeof labelOrData === 'string' && maybeData) {
      if (isObjectFlat(maybeData)) {
        const normalizedRecord = normalizeRecord({
          label: labelOrData,
          payload: maybeData as Record<string, CollectPropertyValue>
        })
        response = await this.api?.records.create<T>(
          new CollectRecordObject(normalizedRecord)
        )
      }
    }

    if (isObject(labelOrData) && typeof maybeData === 'undefined') {
      if (isObjectFlat(labelOrData as T)) {
        const normalizedRecord = normalizeRecord({
          payload: labelOrData as Record<string, CollectPropertyValue>
        })
        response = await this.api?.records.create<T>(
          new CollectRecordObject(normalizedRecord)
        )
      }
    }

    if (response?.success && response?.data) {
      const result = new CollectResult<T>(response?.data)

      result.init(this)
      return result
    }

    return new CollectResult<T>({} as T)
  }

  async createMany<T extends CollectObject = CollectObject>(
    data: CollectImportRecordsObject | T[]
  ): Promise<CollectArrayResult<T>>
  async createMany<T extends CollectObject = CollectObject>(
    label: string,
    data?: CollectImportRecordsObject | T[]
  ): Promise<CollectArrayResult<T>>
  async createMany<T extends CollectObject = CollectObject>(
    labelOrData: CollectImportRecordsObject | T[] | string,
    maybeData?: CollectImportRecordsObject | T[]
  ): Promise<CollectArrayResult<T>> {
    let response

    if (labelOrData instanceof CollectImportRecordsObject) {
      response = await this.api?.records.createMany<T>(labelOrData)
    }

    if (isArray(labelOrData) && typeof maybeData === 'undefined') {
      const data = new CollectImportRecordsObject({
        payload: labelOrData
      })
      response = await this.api?.records.createMany<T>(data)
    }

    if (typeof labelOrData === 'string' && maybeData) {
      const data = new CollectImportRecordsObject({
        label: labelOrData,
        payload: maybeData
      })
      response = await this.api?.records.createMany<T>(data)
    }

    if (response?.success && response?.data) {
      const result = new CollectArrayResult<T>(response.data)
      result.init(this)
      return result
    }

    return new CollectArrayResult<T>([])
  }

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
