import type {
  AnyObject,
  CollectPropertyType,
  CollectPropertyValue,
  CollectPropertyWithValue,
  Enumerable
} from '@collect.so/types'

export class CollectImportRecordsObject {
  label?: string
  options?: {
    generateLabels?: boolean
    returnResult?: boolean
    suggestTypes?: boolean
  }
  parentId?: string
  payload: Enumerable<AnyObject>

  constructor({
    label,
    options = {
      generateLabels: true,
      returnResult: true,
      suggestTypes: true
    },
    parentId,
    payload
  }: {
    label?: string
    options?: {
      generateLabels?: boolean
      returnResult?: boolean
      suggestTypes?: boolean
    }
    parentId?: string
    payload: AnyObject
  }) {
    this.label = label
    this.options = options
    this.parentId = parentId
    this.payload = payload
  }

  public toJson() {
    return {
      label: this.label,
      options: this.options,
      parentId: this.parentId,
      payload: this.payload
    }
  }
}

export class CollectRecordObject {
  label?: string
  parentId?: string
  properties?: Array<{
    metadata?: string
    name: string
    type: CollectPropertyType
    value: CollectPropertyValue
    valueMetadata?: string
    valueSeparator?: string
  }>

  constructor({
    label,
    parentId,
    properties = []
  }: {
    label?: string
    parentId?: string
    properties?: Array<
      CollectPropertyWithValue & {
        metadata?: string
        valueMetadata?: string
        valueSeparator?: string
      }
    >
  }) {
    this.label = label
    this.parentId = parentId
    this.properties = properties
  }

  public toJson() {
    return {
      label: this.label,
      parentId: this.parentId,
      properties: this.properties
    }
  }
}
