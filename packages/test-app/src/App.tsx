import { useEffect, useState } from 'react'
import './App.css'
import SDK, { CollectModel, CollectResult } from '@collect.so/javascript-sdk'

const Collect = new SDK(
  '43b84068213703baa55765e5dd8d8d28ieZ61XVy8JnfsvqpU+fzRKKOHrgFdiZ0Q1njyIfwBO91iZkme9Wqcr3iGd8eqYsS',
  { url: 'http://localhost' }
)

const User = new CollectModel<{ id: string }>('user', { id: 'string' })

const UserRepo = Collect.registerModel(User)

function App() {
  const [records, setRecords] = useState<CollectResult<{ id: string }[]>>()
  const [users, setUsers] = useState<CollectResult<{ id: string }[]>>()

  useEffect(() => {
    const find = async () => {
      const records = await Collect.find<{ id: string }>({ limit: 4, skip: 3 })
      setRecords(records)
      const users = await UserRepo.find({})
      setUsers(users)
    }
    console.log(UserRepo)
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
          {users?.data?.map(({ id }) => (
            <li key={id}>{id}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default App
