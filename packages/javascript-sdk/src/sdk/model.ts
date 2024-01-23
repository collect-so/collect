import type { CollectQuery } from '@collect.so/types'

import type { Validator } from '../validators/types'
import type { CollectResult } from './result'

import { CollectRestApiProxy } from '../api/rest-api-proxy'

export class CollectModel<
  T extends object = object
> extends CollectRestApiProxy {
  private readonly label: string
  public schema: T
  private validator?: Validator

  constructor(modelName: string, schema: T) {
    super()
    this.label = modelName
    this.schema = schema
  }

  setValidator(validator?: Validator) {
    this.validator = validator
  }

  getLabel() {
    return this.label
  }

  async find<T extends object = object>(
    params?: CollectQuery<T>
  ): Promise<CollectResult<T[]>> {
    const modifiedParams = { label: this.label, ...params }
    return this.apiProxy?.find(modifiedParams as CollectQuery<T>) as Promise<
      CollectResult<T[]>
    >
  }

  async validate(data: object) {
    return this.validator?.(this)(this.schema)
  }
}
