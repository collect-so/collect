import type { HttpClient } from '../fetcher/HttpClient.js'
import { UserProvidedConfig } from '../types.js';
import { createFetcher } from '../fetcher/fetcher.js'
import { buildUrl, parseConfig } from './utils.js'
import { CollectQuery } from '@collect.so/types';
import { CollectApiResponse, Label } from '../types/types.js';
import { Result } from './result.js';
import { extractLabelAndParams } from '../utils/utils.js';
import { createApi } from './api.js';

export class CollectRestAPI {
    public api: ReturnType<typeof createApi>
    public fetcher: ReturnType<typeof createFetcher> 

    constructor(token?: string, config?: UserProvidedConfig & {httpClient: HttpClient}) {
        this.fetcher = null as unknown as ReturnType<typeof createFetcher> 
      
        if (token && config?.httpClient) {
        const url = buildUrl(config); // Assuming buildUrl is a utility function
        this.fetcher = createFetcher({ httpClient: config.httpClient, token, url });
      }
      this.api = createApi(this.fetcher)
    }

    public async find<T extends object = object>(
        searchParams?: CollectQuery<T>
      ): Promise<Result<T[]>>
      public async find<T extends object = object>(
        label?: Label,
        searchParams?: CollectQuery<T>
      ): Promise<Result<T[]>>
      public async find<T extends object = object>(
        label?: CollectQuery<T> | Label,
        searchParams?: CollectQuery<T>
      ): Promise<Result<T[]>> {
        const { params } = extractLabelAndParams<T>(
            label as CollectQuery<T> | Label,
          searchParams
        )
    
        const data = await this.api?.findRecords<T>(params)
        return new Result<T[]>(this.api, data.data)
      }
  }