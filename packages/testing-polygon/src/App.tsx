import { useEffect, useState } from 'react'
import './App.css'
import SDK, { CollectModel } from '@collect.so/javascript-sdk'

const Collect = new SDK(
  '43b84068213703baa55765e5dd8d8d28ieZ61XVy8JnfsvqpU+fzRKKOHrgFdiZ0Q1njyIfwBO91iZkme9Wqcr3iGd8eqYsS'
)

const User = new CollectModel('user', {id: 'string'})

const UserRepo = Collect.registerModel(User)



function App() {
  const [records, setRecords] = useState<Array<{ id: string }>>([])

  useEffect(() => {
    console.log(Collect)
    const find = async () => {
      const { data } = await Collect.find<{ id: string }>({ limit: 4, skip: 3 })
      setRecords(data)

      const uuu = await UserRepo.find({})
      console.log({uuu})
    }
    find()
  }, [])

  return (
    <div>
      <ol>
        {records.map(({ id }) => (
          <li key={id}>{id}</li>
        ))}
      </ol>
    </div>
  )
}

export default App
