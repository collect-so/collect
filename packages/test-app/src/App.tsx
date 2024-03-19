import { useEffect, useState } from 'react'
import './App.css'
import CollectSDK, {
  CollectModel,
  type CollectSDKResult,
  type CollectRecordsArrayResult,
  HttpClient,
  HttpClientResponse
} from '@collect.so/javascript-sdk'

class CustomHttpClientResponse extends HttpClientResponse {
  _res: Response
  constructor(response: Response) {
    super(response)
    this._res = response
  }

  getStatusCode() {
    return this._res.status
  }

  toJSON() {
    return this._res.json()
  }
}

class CustomHttpClient extends HttpClient {
  headers: HeadersInit = {}
  constructor(headers: HeadersInit = {} as HeadersInit) {
    super()
    this.headers = headers
  }

  async makeRequest(url: string, { ...init }) {
    const res = await fetch(url, {
      ...init,
      body: JSON.stringify(init.requestData),
      headers: {
        ...init.headers,
        ...this.headers
      }
    })

    return new CustomHttpClientResponse(res)
  }
}

const Collect = new CollectSDK(undefined, {
  url: 'http://localhost',
  httpClient: new CustomHttpClient({
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFydGVtaXkudmVyZXNoY2hpbnNraXlAZ21haWwuY29tIiwiaWQiOiIwMThkYWRmMy1jNzA0LTdlYTctOWY0YS0zZTBjZmRjOGVlYTUiLCJlbWFpbENvbmZpcm1lZCI6dHJ1ZSwiZmlyc3ROYW1lIjoiQXJ0ZW1peSIsImxhc3ROYW1lIjoiVmVyZXNoY2hpbnNraXkiLCJpYXQiOjE3MTA4MTE0NTUsImV4cCI6MTcxMzQwMzQ1NX0.Ghyq5u1Gl-YDQO1sTY5RJSscLV14VV6k_kEBfPMUsrU',
    'X-Project-Id': '018dadf3-d4fc-779e-8c88-9d9212e18610',
    'X-Workspace-Id': '018dadf3-c748-76c2-b701-40a002b3861e'
  })
})

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
  const [records, setRecords] = useState<CollectRecordsArrayResult>()
  const [users, setUsers] = useState<CollectSDKResult<typeof UserRepo.find>>()

  useEffect(() => {
    const find = async () => {
      const records = await Collect.records.find<{ avgIncome: number; age: number }>({
        where: {
          XOR: [
            {
              avgIncome: 29979,
              age: 43
            },
            {
              avgIncome: 29955
            }
          ]
        }
      })
      setRecords(records)
    }
    find()
  }, [])

  const createUser = async () => {
    const tx = await Collect.tx.begin({ ttl: 5000 })

    await UserRepo.create(
      {
        dateOfBirth: '2024-02-20T22:28:56+0000',
        name: '1',
        id: 5,
        jobTitle: 'manager',
        age: 40,
        married: false
      },
      tx
    )
    await UserRepo.create(
      {
        dateOfBirth: '2024-02-20T22:28:56+0000',
        name: '1',
        id: 6,
        jobTitle: 'programmer',
        age: 40,
        married: false
      },
      tx
    )

    await tx.commit()

    await findUsers()
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
          <ol style={{ fontFamily: 'monospace' }}>
            {records?.data?.map(({ _collect_id, _collect_label }, index) => (
              <li key={`${_collect_id}-${index}`}>
                {_collect_label}: {_collect_id}
              </li>
            ))}
          </ol>
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
