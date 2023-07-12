import type {
  Label,
  LabelOrModelOrPayload,
  Model,
  Models,
  RecordPayload,
  Validator
} from '../types'

import { isModel } from '../types'
import { isAnyObject, isLabel } from '../types'
import { yupValidator } from '../validators/yup'
import { createApi } from './api'
import { createFetcher } from './fetcher'

export type BaseInit = {
  baseUrl?: string
  models?: Models
  token: string
  validator?: Validator
}

class Base {
  private registeredModels: Models = {}
  private validator?: Validator
  private _api?: ReturnType<typeof createApi>

  get api() {
    return this._api
  }

  init({
    baseUrl = 'localhost:3000',
    models,
    token,
    validator = yupValidator
  }: BaseInit) {
    this._api = createApi(
      createFetcher({
        baseUrl,
        token
      })
    )
    this.validator = validator
    if (isAnyObject(models)) {
      this.registeredModels = { ...this.registeredModels, ...models }
    }
  }

  registerModel(label: Label, model: Model) {
    if (!isLabel(label)) {
      throw new Error('Label must be a string')
    }
    if (!isModel(model)) {
      throw new Error('Model must be of "Model" type')
    }

    this.registeredModels[label] = model
  }

  async validate(
    labelOrModelOrPayload: LabelOrModelOrPayload,
    payload?: RecordPayload
  ) {
    if (!this.validator) {
      return
    }

    let shouldValidate = false
    let model: Model

    if (isLabel(labelOrModelOrPayload)) {
      shouldValidate = labelOrModelOrPayload in this.registeredModels
      model = this.registeredModels[labelOrModelOrPayload]
    } else {
      shouldValidate = Boolean(
        typeof labelOrModelOrPayload !== undefined && payload
      )
      model = labelOrModelOrPayload as Model
    }

    if (shouldValidate) {
      await this.validator(model)(payload!)
    }
  }
}

export const base = new Base()
