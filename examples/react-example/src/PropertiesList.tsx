import { useEffect, useState } from 'react'
import { Collect } from './api'
import { CollectSDKResult } from '@collect.so/javascript-sdk'

export const PropertiesList = () => {
  const [properties, setProperties] =
    useState<CollectSDKResult<typeof Collect.properties.find>['data']>()

  useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await Collect.properties.find({})
      setProperties(data)
    }

    fetchProperties()
  }, [])

  return (
    <ol style={{ fontFamily: 'monospace' }}>
      {properties?.map(({ name, type }, index) => (
        <li key={`${name}-${index}`}>
          {name}: {type}
        </li>
      ))}
    </ol>
  )
}
