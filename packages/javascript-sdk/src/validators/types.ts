import type { CollectModel } from '../sdk/model'
import type { InferSchemaType } from '../sdk/types'

export type Validator = (
  model: CollectModel
) => (values: InferSchemaType<typeof model.schema>) => Promise<unknown>
