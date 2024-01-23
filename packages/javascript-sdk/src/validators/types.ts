import type { CollectModel } from '../sdk/model'

export type Validator = (
  model: CollectModel
) => (values: typeof model.schema) => Promise<unknown>
