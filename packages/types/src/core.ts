import type { CollectPropertyType } from './entities'

export type CollectModel<T extends CollectObject = CollectObject> = {
  _label?: string
  create: (data: T) => Promise<CollectRecord<T>>
  delete: (id: string) => Promise<CollectRecord<T>>
  update: (id: string, data: Partial<T>) => Promise<CollectRecord<T>>
}

export type CollectObject = Record<
  string,
  boolean | null | number | string | undefined
>

export type CollectRecord<T extends CollectObject = CollectObject> = T

export class CollectDateTimeObject {
  day?: number
  hour?: number
  microsecond?: number
  millisecond?: number
  minute?: number
  month?: number
  nanosecond?: number
  second?: number
  year: number

  constructor({
    day,
    hour,
    microsecond,
    millisecond,
    minute,
    month,
    nanosecond,
    second,
    year
  }: {
    day?: number
    hour?: number
    microsecond?: number
    millisecond?: number
    minute?: number
    month?: number
    nanosecond?: number
    second?: number
    year: number
  }) {
    this.day = day
    this.hour = hour
    this.microsecond = microsecond
    this.millisecond = millisecond
    this.minute = minute
    this.month = month
    this.nanosecond = nanosecond
    this.second = second
    this.year = year
  }
}

type OperationByType = {
  boolean: 'equals' | 'not'
  datetime: 'equals' | 'gt' | 'gte' | 'lt' | 'lte' | 'not'
  null: 'equals' | 'not'
  number: 'equals' | 'gt' | 'gte' | 'in' | 'lt' | 'lte' | 'not' | 'notIn'
  string:
    | 'contains'
    | 'endsWith'
    | 'equals'
    | 'in'
    | 'not'
    | 'notIn'
    | 'startsWith'
}

export type CollectSchema = Record<
  string,
  {
    required?: boolean
    type: CollectPropertyType
  }
>
