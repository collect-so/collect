import type { Label, Model, Models, Validator } from '../types'

import { yupValidator } from '../validators/yup'
import { createApi } from './api'
import { createFetcher } from './fetcher'
import { Result } from './result'

// runtime
export let token: string
export let registeredModels: Models = {}
export let validator: Validator
export let api: ReturnType<typeof createApi>

class Collect extends Result {
  constructor() {
    super()
  }

  init(options: {
    baseUrl?: string
    models?: Models
    token: string
    validator?: Validator
  }) {
    const {
      baseUrl = 'localhost:3000',
      token: tokenOption,
      validator: validatorOption = yupValidator
    } = options

    token = tokenOption
    api = createApi(createFetcher({ baseUrl, token }))

    if (validatorOption) validator = validatorOption

    return this
  }

  get token() {
    return token
  }

  registerModel(label: Label, model: Model) {
    registeredModels[label] = model

    return this
  }
}

export const collect = new Collect()
