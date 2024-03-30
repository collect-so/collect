import type {
  CollectQuery,
  CollectQueryWhere,
  CollectRelations,
  CollectSchema,
  InferTypesFromSchema
} from '@collect.so/types'

import type { Validator } from '../validators/types'
import type { CollectTransaction } from './transaction'

import { CollectRestApiProxy } from '../api/rest-api-proxy'
import { isEmptyObject } from '../utils/utils'
import { UniquenessError } from './errors'
import { checkForInternalDuplicates, mergeDefaultsWithPayload, pickUniqFields } from './utils'

export class CollectModel<
  S extends CollectSchema = CollectSchema,
  R extends CollectRelations = CollectRelations
> extends CollectRestApiProxy {
  private readonly label: string
  public schema: S
  public relationships: R
  private validator?: Validator

  constructor(modelName: string, schema: S, relationships: R = {} as R) {
    super()
    this.label = modelName
    this.schema = schema
    this.relationships = relationships
  }

  setValidator(validator?: Validator) {
    this.validator = validator
  }

  getLabel() {
    return this.label
  }

  async find<T extends InferTypesFromSchema<S> = InferTypesFromSchema<S>>(
    params?: Omit<CollectQuery<T>, 'labels'>,
    transaction?: CollectTransaction | string
  ) {
    return this.apiProxy?.records.find<T>({ ...params, labels: [this.label] }, transaction)
  }

  async create<T extends InferTypesFromSchema<S> = InferTypesFromSchema<S>>(
    record: T,
    transaction?: CollectTransaction | string,
    options: { validate: boolean } = { validate: true }
  ) {
    const data = (await mergeDefaultsWithPayload<typeof this.schema>(this.schema, record)) as T
    const uniqFields = pickUniqFields(this.schema, data) as CollectQueryWhere<
      InferTypesFromSchema<S>
    >

    if (!isEmptyObject(uniqFields)) {
      const tx = transaction ?? (await this.apiProxy.tx.begin())
      const matchingRecords = await this.find({ where: uniqFields }, tx)
      const hasOwnTransaction = typeof transaction !== 'undefined'
      const canCreate = !matchingRecords?.data.length

      if (canCreate) {
        const result = await this.apiProxy.records.create<T>(this.label, data, tx)
        if (!hasOwnTransaction) {
          await (tx as CollectTransaction).commit()
        }
        return result
      } else {
        if (!hasOwnTransaction) {
          await (tx as CollectTransaction).commit()
        }
        throw new UniquenessError(this.label, uniqFields)
      }
    }
    return await this.apiProxy.records.create<T>(this.label, data, transaction)
  }

  async createMany<T extends InferTypesFromSchema<S> = InferTypesFromSchema<S>>(
    records: T[],
    transaction?: CollectTransaction | string,
    options: { validate: boolean } = { validate: true }
  ) {
    // Begin a transaction if one isn't provided.
    const hasOwnTransaction = typeof transaction !== 'undefined'
    const tx = transaction ?? (await this.apiProxy.tx.begin())

    try {
      // Apply defaults and check uniqueness in parallel.
      const processedRecords = await Promise.all(
        records.map(async (record) => {
          const data = (await mergeDefaultsWithPayload<typeof this.schema>(
            this.schema,
            record
          )) as T
          const uniqFields = pickUniqFields(this.schema, data) as CollectQueryWhere<
            InferTypesFromSchema<S>
          >

          if (!isEmptyObject(uniqFields)) {
            const matchingRecords = await this.find({ where: uniqFields }, tx)
            if (matchingRecords?.data.length) {
              throw new UniquenessError(this.label, uniqFields)
            }
          }
          return data
        })
      )

      checkForInternalDuplicates(processedRecords, this.schema, this.label)

      // Create records in the database.
      const createdRecords = await this.apiProxy.records.createMany<T>(
        this.label,
        processedRecords,
        tx
      )

      // Commit the transaction if it was created internally.
      if (!hasOwnTransaction) {
        await (tx as CollectTransaction).commit()
      }

      return createdRecords
    } catch (error) {
      if (!hasOwnTransaction) {
        await (tx as CollectTransaction).rollback()
      }
      throw error
    }
  }

  async delete<T extends InferTypesFromSchema<S> = InferTypesFromSchema<S>>(
    params?: Omit<CollectQuery<T>, 'labels'>,
    transaction?: CollectTransaction | string
  ) {
    return await this.apiProxy.records.delete({ ...params, labels: [this.label] }, transaction)
  }

  async validate(data: InferTypesFromSchema<S>) {
    return this.validator?.(this as CollectModel<CollectSchema>)(data)
  }
}

export function createCollectModel<S extends CollectSchema>(
  modelName: string,
  schema: S
): CollectModel<S> {
  return new CollectModel<S>(modelName, schema)
}
