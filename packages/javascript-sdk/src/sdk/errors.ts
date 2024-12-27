export class UniquenessError extends Error {
  constructor(label: string, properties: any) {
    super(
      `Record with label "${label}" and properties ${JSON.stringify(properties)} already exists`
    )
    this.name = 'UniquenessError'
    Object.setPrototypeOf(this, UniquenessError.prototype)
  }
}

export class EmptyTargetError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EmptyTarget'
    Object.setPrototypeOf(this, EmptyTargetError.prototype)
  }
}

export class NonUniqueResultError extends Error {
  constructor(duplicateCount: number, searchParams: Record<string, any>) {
    super(
      `Expected a unique result but found ${duplicateCount} matches for the provided search parameters: ${JSON.stringify(
        searchParams
      )}. Ensure your search parameters uniquely identify a single result.`
    )
    this.name = 'NonUniqueResultError'
    Object.setPrototypeOf(this, NonUniqueResultError.prototype)
  }
}
