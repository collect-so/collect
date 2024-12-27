import type {
  CollectQuery,
  CollectSchema,
  FlattenTypes,
  InferSchemaTypesRead,
  InferSchemaTypesWrite,
  MaybeArray
} from '../types/index.js'
import type {
  CollectRecord,
  CollectRecordInstance,
  CollectRecordsArrayInstance,
  CollectRelationDetachOptions,
  CollectRelationOptions,
  CollectRelationTarget
} from './record.js'
import type { CollectTransaction } from './transaction.js'

import { CollectRestApiProxy } from '../api/rest-api-proxy.js'
import { isEmptyObject } from '../common/utils.js'
import { EmptyTargetError, UniquenessError } from './errors.js'
import {
  mergeDefaultsWithPayload,
  pickUniqFieldsFromRecord,
  pickUniqFieldsFromRecords
} from './utils.js'

type CollectInstance = {
  registerModel(model: CollectModel): void
}

export class CollectModel<Schema extends CollectSchema = any> extends CollectRestApiProxy {
  public readonly label: string
  public readonly schema: Schema

  constructor(modelName: string, schema: Schema, collectInstance?: CollectInstance) {
    super()
    this.label = modelName
    this.schema = schema

    collectInstance?.registerModel(this)
  }

  /** @description
   * Type helper for a draft version of the schema.
   * Represents a flat object containing only the record's own properties
   * (defined by the schema), excluding system fields such as `__id`, `__label`,
   * and `__proptypes`. This type does not yet have a representation on the
   * database side.
   */
  readonly draft!: CollectInferType<CollectModel<Schema>>

  /** @description
   * Type helper for a fully-defined record with database representation.
   * Similar to the draft, but includes all fields that come with the record's
   * database-side representation, such as `__id`, `__label`, and `__proptypes`.
   */
  readonly record!: CollectRecord<Schema>

  /** @description
   * Type helper for a single record instance.
   * Extends the record by providing additional methods to operate on this specific
   * record, such as saving, updating, or deleting it.
   */
  readonly recordInstance!: CollectRecordInstance<Schema>

  /** @description
   * Type helper for an array of record instances.
   * Similar to a single record instance but supports batch or bulk operations,
   * allowing efficient management of multiple records simultaneously.
   */
  readonly recordsArrayInstance!: CollectRecordsArrayInstance<Schema>

  getLabel() {
    return this.label
  }

  async find(
    params: CollectQuery<Schema> & { labels?: never } = {},
    transaction?: CollectTransaction | string
  ) {
    return this.apiProxy?.records.find<Schema>(this.label, params, transaction)
  }

  async findOne(
    params: CollectQuery<Schema> & { labels?: never; limit?: never; skip?: never } = {},
    transaction?: CollectTransaction | string
  ) {
    return this.apiProxy?.records.findOne<Schema>(this.label, { ...params }, transaction)
  }

  async findById(id: string, transaction?: CollectTransaction | string) {
    return this.findOne({ where: { $id: id } }, transaction)
  }

  async findUniq(
    params: CollectQuery<Schema> & { labels?: never; limit?: never; skip?: never } = {},
    transaction?: CollectTransaction | string
  ) {
    return this.apiProxy?.records.findUniq<Schema>(this.label, { ...params }, transaction)
  }

  async create(record: InferSchemaTypesWrite<Schema>, transaction?: CollectTransaction | string) {
    const data = await mergeDefaultsWithPayload<Schema>(this.schema, record)

    const uniqFields = pickUniqFieldsFromRecord(this.schema, data)

    if (!isEmptyObject(uniqFields)) {
      const tx = transaction ?? (await this.apiProxy.tx.begin())
      const matchingRecords = await this.find({ where: uniqFields }, tx)
      const hasOwnTransaction = typeof transaction !== 'undefined'
      const canCreate = !matchingRecords?.data?.length

      if (canCreate) {
        const result = await this.apiProxy.records.create<Schema>(this.label, data, tx)
        if (!hasOwnTransaction) {
          await (tx as CollectTransaction).commit() // http req 4
        }
        return result
      } else {
        if (!hasOwnTransaction) {
          await (tx as CollectTransaction).commit()
        }

        // @TODO: Make it optional
        throw new UniquenessError(this.label, uniqFields)
      }
    }
    return await this.apiProxy.records.create<Schema>(this.label, data, transaction)
  }

  attach(
    sourceId: string,
    target: CollectRelationTarget,
    options?: CollectRelationOptions,
    transaction?: CollectTransaction | string
  ) {
    return this.apiProxy.records.attach(sourceId, target, options, transaction)
  }

  detach(
    sourceId: string,
    target: CollectRelationTarget,
    options?: CollectRelationDetachOptions,
    transaction?: CollectTransaction | string
  ) {
    return this.apiProxy.records.detach(sourceId, target, options, transaction)
  }

  private async handleSetOrUpdate(
    id: string,
    record: Partial<InferSchemaTypesWrite<Schema>>,
    method: 'set' | 'update',
    transaction?: CollectTransaction | string
  ) {
    const data = await mergeDefaultsWithPayload<Schema>(this.schema, record)
    const uniqFields = pickUniqFieldsFromRecord(this.schema, data)

    if (!isEmptyObject(uniqFields)) {
      const tx = transaction ?? (await this.apiProxy.tx.begin())
      const matchingRecords = await this.find({ where: uniqFields }, tx)
      const hasOwnTransaction = typeof transaction !== 'undefined'

      const canUpdate =
        !matchingRecords?.data?.length ||
        (matchingRecords.data.length === 1 && matchingRecords.data[0].__id === id)

      if (canUpdate) {
        const result = await this.apiProxy.records[method]<Schema>(id, data, tx)

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

    return await this.apiProxy.records[method]<Schema>(id, data, transaction)
  }

  async set(
    id: string,
    record: InferSchemaTypesWrite<Schema>,
    transaction?: CollectTransaction | string
  ) {
    return await this.handleSetOrUpdate(id, record, 'set', transaction)
  }

  async update(
    id: string,
    record: Partial<InferSchemaTypesWrite<Schema>>,
    transaction?: CollectTransaction | string
  ) {
    return await this.handleSetOrUpdate(id, record, 'update', transaction)
  }

  async createMany(
    records: InferSchemaTypesWrite<Schema>[],
    transaction?: CollectTransaction | string
  ) {
    // Begin a transaction if one isn't provided.
    const hasOwnTransaction = typeof transaction !== 'undefined'
    const tx = transaction ?? (await this.apiProxy.tx.begin())

    try {
      // Apply defaults in parallel
      const recordsToStore = await Promise.all(
        records.map(async (record) => {
          return await mergeDefaultsWithPayload<Schema>(this.schema, record)
        })
      )

      // Check uniqueness
      const uniqProperties = pickUniqFieldsFromRecords(
        recordsToStore as Partial<InferSchemaTypesWrite<Schema>>[],
        this.schema,
        this.label
      )
      if (!isEmptyObject(uniqProperties)) {
        const criteria = Object.entries(uniqProperties).map(([key, values]) => ({
          [key]: { $in: values }
        }))
        const matchingRecords = await this.find(
          {
            where: {
              $or: criteria
            }
          },
          tx
        )
        if (matchingRecords?.data?.length) {
          throw new UniquenessError(this.label, Object.keys(uniqProperties))
        }
      }

      // Create records in the database
      const createdRecords = await this.apiProxy.records.createMany<Schema>(
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

  async delete(
    searchParams: Omit<CollectQuery<Schema>, 'labels'>,
    transaction?: CollectTransaction | string
  ) {
    if (isEmptyObject(searchParams.where)) {
      throw new EmptyTargetError(
        `You must specify criteria to delete records of type '${this.label}'. Empty criteria are not allowed. If this was intentional, use the Dashboard instead.`
      )
    }

    return await this.apiProxy.records.delete(
      { ...searchParams, labels: [this.label] },
      transaction
    )
  }

  async deleteById(idOrIds: MaybeArray<string>, transaction?: CollectTransaction | string) {
    return await this.apiProxy.records.deleteById(idOrIds, transaction)
  }
}

export type CollectInferType<Model extends CollectModel<any> = CollectModel<any>> = FlattenTypes<
  InferSchemaTypesRead<Model['schema']>
>
