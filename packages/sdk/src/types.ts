export type Model = { validate: (values: AnyObject) => Promise<unknown> }

export type Models = Record<Label, Model>

export type Label = string

export type LabelOrModel = Label | Model

export type LabelOrModelOrPayload = Label | Model | RecordPayload

export const isLabel = (param: unknown): param is Label =>
  typeof param === 'string'

export const isModel = (param: unknown): param is Model =>
  isAnyObject(param) && 'validate' in param

export const isLabelOrModel = (param: unknown): param is LabelOrModel =>
  isModel(param) || isLabel(param)

export type AnyObject = Record<string, unknown>

export const isAnyObject = (input: unknown): input is AnyObject =>
  typeof input === 'object' && input !== null && !Array.isArray(input)

export type RecordPayload = AnyObject

export type SearchParams = AnyObject

export type RecordId = number | string

export type AnyRecord = { id: RecordId }

export type AnyResult = { data?: AnyObject }

export const isRecordId = (param: unknown): param is RecordId =>
  typeof param === 'string' || typeof param === 'number'

export type PropertyValue = Array<number | string> | number | string

export type PropertyType = 'boolean' | 'datetime' | 'number' | 'string'

export type Property = {
  metadata?: string
  name: string
  type?: PropertyType
  units?: string
  value: PropertyValue
}

export type Validator = (
  model: Model
) => (values: AnyObject) => Promise<unknown>

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
