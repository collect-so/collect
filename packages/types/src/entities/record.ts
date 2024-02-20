import type { CollectObject } from '../core'
import type { CollectProperty, CollectPropertyValue } from './property'

export type CollectRecordOwnProps = {
  _collect_id: string
  _collect_label: string
  _collect_metadata_: {
    parentId: string
    projectId: string
  }
}

export type CollectRecordNew<T extends CollectObject = CollectObject> =
  CollectRecordOwnProps & T

export type CollectRecordResponse = {
  id: string
  label?: string
  parentId: string
  projectId: string
  properties: CollectProperty[]
}

export type CollectRecordPlain = Record<string, CollectPropertyValue>
