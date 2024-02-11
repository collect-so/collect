import type { CollectQuery } from '@collect.so/types'

import type { Validator } from '../validators/types'
import type { CollectArrayResult } from './result'
import type { CollectRelations, CollectSchema, InferSchemaType } from './types'

import { CollectRestApiProxy } from '../api/rest-api-proxy'

export class CollectModel<
  T extends CollectSchema = CollectSchema
> extends CollectRestApiProxy {
  private readonly label: string
  public schema: T
  public relationships: CollectRelations
  private validator?: Validator

  constructor(
    modelName: string,
    schema: T,
    relationships: CollectRelations = {}
  ) {
    super()
    this.label = modelName
    this.schema = schema
    this.relationships = relationships
  }

  setValidator(validator?: Validator) {
    this.validator = validator
  }

  getLabel() {
    return this.label
  }

  async find(
    params?: CollectQuery<InferSchemaType<T>>
  ): Promise<CollectArrayResult<InferSchemaType<T>>> {
    const modifiedParams = { labels: [this.label], ...params }
    return this.apiProxy?.find<InferSchemaType<T>>(
      modifiedParams as CollectQuery<InferSchemaType<T>>
    ) as Promise<CollectArrayResult<InferSchemaType<T>>>
  }

  async validate(data: InferSchemaType<T>) {
    return this.validator?.(this)(data)
  }
}

export function createCollectModel<T extends CollectSchema>(
  modelName: string,
  schema: T
): CollectModel<T> {
  return new CollectModel<T>(modelName, schema)
}
