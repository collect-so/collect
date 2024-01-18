export type Model = { validate: (values: AnyObject) => Promise<unknown> }

export type Label = string

export type LabelOrModel = Label | Model

export type LabelOrModelOrPayload = Label | Model | RecordPayload


export type RecordPayload = AnyObject

export type SearchParams = AnyObject

export type RecordId = number | string


export type PropertyValue = Array<number | string> | number | string

export type PropertyType = 'boolean' | 'datetime' | 'number' | 'string'
export type AnyRecord = { id: RecordId }

export type AnyResult = { data?: AnyObject }

export type AnyObject = Record<string, unknown>



