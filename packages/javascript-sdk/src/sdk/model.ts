import type {
  CollectQuery,
  CollectSchema,
  FlattenTypes,
  InferSchemaTypesRead,
  InferSchemaTypesWrite,
  MaybeArray
} from '../types/index.js'
import type {
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
    params: CollectQuery<Schema> & { labels?: never } = {},
    transaction?: CollectTransaction | string
  ) {
    return this.apiProxy?.records.findOne<Schema>(this.label, { ...params }, transaction)
  }

  async findById(id: string, transaction?: CollectTransaction | string) {
    return this.apiProxy?.records.findById<Schema>(id, transaction)
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
          await (tx as CollectTransaction).commit()
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
    relationConfig: {
      sourceId: string
      target: CollectRelationTarget
      options?: CollectRelationOptions
    },
    transaction?: CollectTransaction | string
  ) {
    return this.apiProxy.records.attach(
      {
        source: relationConfig.sourceId,
        target: relationConfig.target,
        options: relationConfig.options
      },
      transaction
    )
  }

  detach(
    relationConfig: {
      sourceId: string
      target: CollectRelationTarget
      options?: CollectRelationDetachOptions
    },
    transaction?: CollectTransaction | string
  ) {
    return this.apiProxy.records.detach(
      {
        source: relationConfig.sourceId,
        target: relationConfig.target,
        options: relationConfig.options
      },
      transaction
    )
  }

  async updateById(
    id: string,
    record: InferSchemaTypesWrite<Schema>,
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
        const result = await this.apiProxy.records.update<Schema>(id, data, tx)

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
    return await this.apiProxy.records.update<Schema>(id, data, transaction)
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
