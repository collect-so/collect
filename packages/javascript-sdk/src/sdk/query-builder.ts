import type {
  CollectObject,
  CollectQueryCondition,
  CollectQueryWhere,
  CollectSchema
} from '@collect.so/types'

export class QueryBuilder<
  T extends CollectObject | CollectSchema = CollectSchema
> {
  private whereCondition: CollectQueryWhere<T> | undefined

  private setCondition(condition: CollectQueryWhere<T>): QueryBuilder<T> {
    if (this.whereCondition) {
      throw new Error(
        'Cannot combine direct conditions with logical groupings directly at the root level.'
      )
    }
    this.whereCondition = condition
    return this
  }

  public where<K extends keyof T>(
    field: K,
    condition: CollectQueryCondition<T>[K]
  ): QueryBuilder<T> {
    if (this.whereCondition) {
      throw new Error(
        'Direct conditions cannot be combined with logical groupings at the root level. Consider using a logical operator method (and, or, not, xor) to group conditions.'
      )
    }
    this.whereCondition = { [field]: condition } as CollectQueryCondition<T>
    return this
  }

  public build(): CollectQueryWhere<T> {
    if (!this.whereCondition) {
      throw new Error('No conditions have been added to the query')
    }
    return this.whereCondition
  }
}
