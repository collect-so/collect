import type {
  CollectQuery,
  CollectRelations,
  CollectSchema,
  Enumerable,
  InferTypesFromSchema
} from '@collect.so/types'

import type { Validator } from '../validators/types'
import type { CollectArrayResult, CollectResult } from './result'

import { CollectRestApiProxy } from '../api/rest-api-proxy'

export class CollectModel<
  S extends CollectSchema = CollectSchema,
  R extends CollectRelations = CollectRelations
> extends CollectRestApiProxy {
  private readonly label: string
  public schema: S
  public relationships: R
  private validator?: Validator

  constructor(modelName: string, schema: S, relationships: R = {} as R) {
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

  async find(params?: CollectQuery<InferTypesFromSchema<S>>) {
    const modifiedParams = { labels: [this.label], ...params }
    return this.apiProxy?.find<InferTypesFromSchema<S>>(modifiedParams)
  }

  async create<T extends InferTypesFromSchema<S> = InferTypesFromSchema<S>>(
    record: T
  ) {
    return (await this.apiProxy.create<T>(
      this.label,
      record
    )) as CollectResult<T>
  }
  async createMany(records: InferTypesFromSchema<S>[]) {
    return await this.apiProxy.createMany<InferTypesFromSchema<S>>(
      this.label,
      records
    )
  }

  async validate(data: InferTypesFromSchema<S>) {
    return this.validator?.(this as CollectModel<CollectSchema>)(data)
  }
}

export function createCollectModel<S extends CollectSchema>(
  modelName: string,
  schema: S
): CollectModel<S> {
  return new CollectModel<S>(modelName, schema)
}
