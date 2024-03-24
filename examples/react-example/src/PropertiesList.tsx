import { useEffect, useState } from 'react'
import { Collect } from './api'
import { CollectProperty } from '@collect.so/types'

export const PropertiesList = () => {
  const [properties, setProperties] = useState<CollectProperty[]>([])

  useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await Collect.properties.find({})
      setProperties(data)
    }

    fetchProperties()
  }, [])

  return (
    <ol style={{ fontFamily: 'monospace' }}>
      {properties.map(({ name, type }, index) => (
        <li key={`${name}-${index}`}>
          {name}: {type}
        </li>
      ))}
    </ol>
  )
}
