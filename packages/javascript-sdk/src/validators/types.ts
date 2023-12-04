import { AnyObject, Model } from '../types/types.js'

export type Validator = (
  model: Model
) => (values: AnyObject) => Promise<unknown>
