import { useEffect, useState } from 'react'
import './App.css'
import CollectSDK, {
  CollectModel,
  type CollectSDKResult,
  type CollectArrayResult
} from '@collect.so/javascript-sdk'

const Collect = new CollectSDK(
  '071fe6b3a94d1cc23e18a7cdc0131f926RDjUjkBtYNLnkWNG21TEXcvwjbm4GD9ZN05A0LIR7g3Cr0yuuQGau3gJaLIpPcT',
  { url: 'http://localhost' }
)

const User = new CollectModel(
  'user',
  {
    name: { type: 'string' },
    id: { type: 'number' },
    jobTitle: { type: 'string' },
    age: { type: 'number' },
    married: { type: 'boolean' },
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
          jobTitle: '11',
          id: {
            lt: 1
          },
          name: ';',
          dateOfBirth: {
            year: 1993,
            day: 1
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
          {records?.data?.map(({ id }, index) => (
            <li key={`${id}-${index}`}>{id}</li>
          ))}
        </ol>
      </div>
      <div>
        <p>Users</p>
        <ol>
          {users?.data?.map(({ id }) => (
            <li key={id}>{id}</li>
          ))}
        </ol>
      </div>
      <button
        onClick={async () =>
          await UserRepo.create({
            dateOfBirth: '',
            name: '1',
            id: 5,
            jobTitle: 'manager',
            age: 40,
            married: false
          })
        }
      >
        create user
      </button>
    </div>
  )
}

export default App
