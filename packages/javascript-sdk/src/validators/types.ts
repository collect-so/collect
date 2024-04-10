import type { CollectSchema, InferSchemaTypesWrite } from '@collect.so/types'

import type { CollectModel } from '../sdk/model'

export type Validator<T extends CollectSchema = CollectSchema> = (
  model: CollectModel<T>
) => (values: InferSchemaTypesWrite<typeof model.schema>) => Promise<unknown>
