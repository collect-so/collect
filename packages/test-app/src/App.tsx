import { useEffect, useState } from 'react'
import './App.css'
import CollectSDK, {
  CollectModel,
  type CollectSDKResult,
  type CollectArrayResult
} from '@collect.so/javascript-sdk'

const Collect = new CollectSDK(
  'd73d1449bd4900867c769bb9113d6b08jiVO5MCNivxFobp23sYOflCghabVoJ0SJJfzTDMp4VNV4iqF2HXTCGdJdyKtsEa+',
  { url: 'http://localhost' }
)

const User = new CollectModel(
  'user',
  {
    name: { type: 'string' },
    id: { type: 'number' },
    dateOfBirth: { type: 'datetime', required: false }
  },
  {
    orders: {
      modelName: 'order',
      direction: 'out',
      type: 'HAS_ORDER'
    }
  }
)

const UserRepo = Collect.registerModel(User)

function App() {
  const [records, setRecords] = useState<CollectArrayResult>()
  const [users, setUsers] = useState<CollectSDKResult<typeof UserRepo.find>>()

  useEffect(() => {
    const find = async () => {
      const records = await Collect.find({
        where: {
          XOR: {
            avgIncome: {
              gt: 20000
            },
            favoriteCategory: {
              contains: 'Ethnic'
            },
            eyeColor: {
              contains: 'green'
            },
            birthday: {
              day: 28,
              month: 1,
              year: 1994
            }
          }
        }
      })
      setRecords(records)
      const users = await UserRepo.find({
        where: {
          id: {
            startsWith: '098'
          },
          name: ';',
          dateOfBirth: {
            year: 1994
          }
        }
      })
      setUsers(users)
    }
    find()
  }, [])

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <p>Data</p>
        <ol>
          {records?.data?.map(({ id }) => (
            <li key={id}>{id}</li>
          ))}
        </ol>
      </div>
      <div>
        <p>Users</p>
        <ol>
          {users?.data?.map(({ id, name, dateOfBirth }) => (
            <li key={id}>{id}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default App
