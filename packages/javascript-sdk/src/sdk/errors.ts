export class UniquenessError extends Error {
  constructor(label: string, properties: any) {
    super(
      `Collect Uniqueness Error: Record with label "${label}" and properties ${JSON.stringify(properties)} already exists`
    )
    this.name = 'UniquenessError'
    Object.setPrototypeOf(this, UniquenessError.prototype)
  }
}

export class ValidationError extends Error {
  errors: { [key: string]: string } | string

  constructor(errors: { [key: string]: string } | string) {
    super('Validation failed')
    this.errors = errors
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}
