import type { CollectSchema } from '../common/types'
import type { CollectModel } from '../sdk/model'
import type { InferSchemaTypesWrite } from '../types'

export type Validator<T extends CollectSchema = CollectSchema> = (
  model: CollectModel<T>
) => (values: InferSchemaTypesWrite<typeof model.schema>) => Promise<unknown>
