import type { CollectSchema, InferTypesFromSchema } from '@collect.so/types'

import type { CollectModel } from '../sdk/model'

export type Validator<T extends CollectSchema = CollectSchema> = (
  model: CollectModel<T>
) => (values: InferTypesFromSchema<typeof model.schema>) => Promise<unknown>
