import type { CollectSchema, InferSchemaType } from '@collect.so/types'

import type { CollectModel } from '../sdk/model'

export type Validator<T extends CollectSchema = CollectSchema> = (
  model: CollectModel<T>
) => (values: InferSchemaType<typeof model.schema>) => Promise<unknown>
