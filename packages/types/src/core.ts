export type CollectModel<T extends object = object> = {
  _label?: string
  create: (data: T) => Promise<CollectRecord<T>>
  delete: (id: string) => Promise<CollectRecord<T>>
  update: (id: string, data: Partial<T>) => Promise<CollectRecord<T>>
}

export type CollectRecord<T extends object = object> = T

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
