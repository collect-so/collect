import type {
  CollectQuery,
  CollectRelationTarget,
  CollectRelations,
  CollectSchema,
  InferSchemaTypesWrite
} from '../types'
import type { Validator } from '../validators/types'
import type { CollectTransaction } from './transaction'

import { CollectRestApiProxy } from '../api/rest-api-proxy'
import { isEmptyObject } from '../utils/utils'
import { UniquenessError } from './errors'
import {
  mergeDefaultsWithPayload,
  pickUniqFieldsFromRecord,
  pickUniqFieldsFromRecords
} from './utils'

export class CollectModel<
  S extends CollectSchema = any,
  R extends CollectRelations = CollectRelations
> extends CollectRestApiProxy {
  public readonly label: string
  public readonly schema: S
  public readonly relationships: R
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

  async find(
    params?: CollectQuery<S> & { labels?: never },
    transaction?: CollectTransaction | string
  ) {
    return this.apiProxy?.records.find<S>(this.label, params, transaction)
  }

  async findOne(
    params?: CollectQuery<S> & { labels?: never },
    transaction?: CollectTransaction | string
  ) {
    return this.apiProxy?.records.findOne<S>(this.label, { ...params }, transaction)
  }

  async findById(id: string, transaction?: CollectTransaction | string) {
    return this.apiProxy?.records.findById<S>(id, transaction)
  }

  async create(
    record: InferSchemaTypesWrite<S>,
    transaction?: CollectTransaction | string,
    options: { validate: boolean } = { validate: true }
  ) {
    const data = await mergeDefaultsWithPayload<S>(this.schema, record)

    const uniqFields = pickUniqFieldsFromRecord(this.schema, data)

    if (!isEmptyObject(uniqFields)) {
      const tx = transaction ?? (await this.apiProxy.tx.begin())
      const matchingRecords = await this.find({ where: uniqFields }, tx)
      const hasOwnTransaction = typeof transaction !== 'undefined'
      const canCreate = !matchingRecords?.data.length

      if (canCreate) {
        const result = await this.apiProxy.records.create<InferSchemaTypesWrite<S>>(
          this.label,
          data,
          tx
        )
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
    return await this.apiProxy.records.create<InferSchemaTypesWrite<S>>(
      this.label,
      data,
      transaction
    )
  }

  attach(
    sourceId: string,
    target: CollectRelationTarget,
    transaction?: CollectTransaction | string
  ) {
    return this.apiProxy.records.attach(sourceId, target, transaction)
  }

  detach(
    sourceId: string,
    target: CollectRelationTarget,
    transaction?: CollectTransaction | string
  ) {
    return this.apiProxy.records.detach(sourceId, target, transaction)
  }

  async update(
    id: string,
    record: InferSchemaTypesWrite<S>,
    transaction?: CollectTransaction | string,
    options: { validate: boolean } = { validate: true }
  ) {
    const data = await mergeDefaultsWithPayload<S>(this.schema, record)

    const uniqFields = pickUniqFieldsFromRecord(this.schema, data)

    if (!isEmptyObject(uniqFields)) {
      const tx = transaction ?? (await this.apiProxy.tx.begin())
      const matchingRecords = await this.find({ where: uniqFields }, tx)
      const hasOwnTransaction = typeof transaction !== 'undefined'

      const canUpdate =
        !matchingRecords?.data.length ||
        (matchingRecords.data.length === 1 && matchingRecords.data[0].__id === id)

      if (canUpdate) {
        const result = await this.apiProxy.records.update<S>(id, data, tx)
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
    return await this.apiProxy.records.update<S>(id, data, transaction)
  }

  async createMany(
    records: InferSchemaTypesWrite<S>[],
    transaction?: CollectTransaction | string,
    options: { validate: boolean } = { validate: true }
  ) {
    // Begin a transaction if one isn't provided.
    const hasOwnTransaction = typeof transaction !== 'undefined'
    const tx = transaction ?? (await this.apiProxy.tx.begin())

    try {
      // Apply defaults in parallel
      const recordsToStore = await Promise.all(
        records.map(async (record) => {
          const data = (await mergeDefaultsWithPayload<typeof this.schema>(
            this.schema,
            record
          )) as InferSchemaTypesWrite<S>

          return data
        })
      )

      // Check uniqueness
      const uniqProperties = pickUniqFieldsFromRecords(recordsToStore, this.schema, this.label)
      if (!isEmptyObject(uniqProperties)) {
        const criteria = Object.entries(uniqProperties).map(([key, values]) => ({
          [key]: { $in: values }
        }))
        const matchingRecords = await this.find(
          {
            where: {
              $OR: criteria
            }
          },
          tx
        )
        if (matchingRecords?.data.length) {
          throw new UniquenessError(this.label, Object.keys(uniqProperties))
        }
      }

      // Create records in the database
      const createdRecords = await this.apiProxy.records.createMany<S>(
        this.label,
        recordsToStore,
        tx
      )

      // Commit the transaction if it was created internally
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

  async delete<T extends InferSchemaTypesWrite<S> = InferSchemaTypesWrite<S>>(
    params?: Omit<CollectQuery<T>, 'labels'>,
    transaction?: CollectTransaction | string
  ) {
    return await this.apiProxy.records.delete({ ...params, labels: [this.label] }, transaction)
  }

  async validate(data: InferSchemaTypesWrite<S>) {
    return this.validator?.(this as CollectModel<CollectSchema>)(data)
  }
}

export function createCollectModel<S extends CollectSchema>(
  modelName: string,
  schema: S
): CollectModel<S> {
  return new CollectModel<S>(modelName, schema)
}
