import type { Label, Model } from '../types'
import type { BaseInit } from './base'

import { base } from './base'
import { Result } from './result'

class Collect extends Result {
  constructor() {
    super()
  }

  init(options: BaseInit) {
    base.init(options)

    return this
  }

  registerModel(label: Label, model: Model) {
    base.registerModel(label, model)

    return this
  }
}

export const collect = new Collect()
