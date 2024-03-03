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
      model: 'order',
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
    }
    find()
  }, [])

  const createUser = async () => {
    const user = await UserRepo.create({
      dateOfBirth: '2024-02-20T22:28:56+0000',
      name: '1',
      id: 5,
      jobTitle: 'manager',
      age: 40,
      married: false
    })

    console.log(user)
    findUsers()
  }

  const createMultipleUsers = async () => {
    const users = await UserRepo.createMany([
      {
        dateOfBirth: '2024-02-20T22:28:56+0000',
        name: '1',
        id: 5,
        jobTitle: 'manager',
        age: 40,
        married: false
      },
      {
        dateOfBirth: '2024-02-20T22:28:56+0000',
        name: '1',
        id: 5,
        jobTitle: 'manager',
        age: 40,
        married: false
      }
    ])
    console.log(users)
    findUsers()
  }

  const findUsers = async () => {
    const users = await UserRepo.find()
    setUsers(users)
  }

  useEffect(() => {
    findUsers()
  }, [])

  return (
    <>
      <header>
        <button onClick={createUser}>create user</button>
        <button onClick={createMultipleUsers}>create multiple users</button>
      </header>
      <div style={{ display: 'flex' }}>
        <div>
          <p>Data</p>
          <ol>{records?.data?.map(({ id }, index) => <li key={`${id}-${index}`}>{id}</li>)}</ol>
        </div>
      </div>
      <div>
        <p>Users</p>
        <div style={{ display: 'grid' }}>
          {users?.data?.map((user) => (
            <div key={user.id} style={{ textAlign: 'left' }} className="card">
              {Object.entries(user)
                .filter(([key]) => key !== '_collect_propsMetadata')
                .map(([key, value]) => (
                  <li key={key}>
                    {key}: <span>{JSON.stringify(value)}</span>
                  </li>
                ))}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
