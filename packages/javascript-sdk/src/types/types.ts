export type Model = { validate: (values: AnyObject) => Promise<unknown> }

export type Label = string

export type LabelOrModel = Label | Model

export type RecordId = number | string

export type AnyObject = Record<string, unknown>
