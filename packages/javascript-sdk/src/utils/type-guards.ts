import type {
  AnyObject,
  Label,
  LabelOrModel,
  Model,
  RecordId
} from '../types/types.js'

export const isLabel = (param: unknown): param is Label =>
  typeof param === 'string'

export const isModel = (param: unknown): param is Model =>
  isAnyObject(param) && 'validate' in param

export const isLabelOrModel = (param: unknown): param is LabelOrModel =>
  isModel(param) || isLabel(param)

export const isAnyObject = (input: unknown): input is AnyObject =>
  typeof input === 'object' && input !== null && !Array.isArray(input)

export const isRecordId = (param: unknown): param is RecordId =>
  typeof param === 'string' || typeof param === 'number'

export const isResultWithId = (
  maybeResult: unknown
): maybeResult is {
  data: { id: RecordId }
} => {
  return (
    isAnyObject(maybeResult) &&
    isAnyObject(maybeResult?.data) &&
    isRecordId(maybeResult?.data['id'])
  )
}
