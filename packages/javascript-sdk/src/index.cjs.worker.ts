import { FetchHttpClient } from './network/FetchHttpClient.js'
import { HttpClient, HttpClientResponse } from './network/HttpClient.js'
import {
  CollectBatchDraft,
  CollectModel,
  CollectRecordInstance,
  CollectRecordsArrayInstance,
  CollectTransaction,
  EmptyTargetError,
  NotFoundError,
  UniquenessError,
  ValidationError,
  createCollect,
  idToDate,
  idToTimestamp
} from './sdk/index.js'

const Collect = createCollect(new FetchHttpClient())

module.exports = {
  Collect,
  CollectBatchDraft,
  CollectModel,
  CollectRecordInstance,
  CollectRecordsArrayInstance,
  CollectTransaction,
  EmptyTargetError,
  HttpClient,
  HttpClientResponse,
  NotFoundError,
  UniquenessError,
  ValidationError,
  default: Collect,
  idToDate,
  idToTimestamp
}

module.exports.Collect = Collect

module.exports.default = Collect
