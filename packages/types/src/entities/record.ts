import type { CollectProperty, CollectPropertyValue } from './property'

export type CollectRecordResponse = {
  created: string
  id: string
  label?: string
  parentId: string
  projectId: string
  properties: CollectProperty[]
  relations: Record<string, number>
  root?: boolean
}

export type CollectRecordPlain = Record<string, CollectPropertyValue>
