import type {
  CollectQuery,
  CollectRelations,
  CollectSchema,
  InferTypesFromSchema
} from '@collect.so/types'

import type { Validator } from '../validators/types'
import type { CollectTransaction } from './transaction'

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

  async find<T extends InferTypesFromSchema<S> = InferTypesFromSchema<S>>(
    params?: Omit<CollectQuery<T>, 'labels'>
  ) {
    const modifiedParams = { ...params, labels: [this.label] }
    return this.apiProxy?.records.find<T>(modifiedParams)
  }

  async create<T extends InferTypesFromSchema<S> = InferTypesFromSchema<S>>(
    record: T,
    transaction?: CollectTransaction | string,
    options: { validate: boolean } = { validate: true }
  ) {
    return await this.apiProxy.records.create<T>(this.label, record, transaction)
  }
  async createMany<T extends InferTypesFromSchema<S> = InferTypesFromSchema<S>>(
    records: T[],
    transaction?: CollectTransaction | string,
    options: { validate: boolean } = { validate: true }
  ) {
    return await this.apiProxy.records.createMany<T>(this.label, records, transaction)
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
