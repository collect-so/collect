import { useEffect, useState } from 'react'
import './App.css'
import { Collect, UserRepo } from './api'
import { CollectRecordsArrayResult, CollectSDKResult } from '@collect.so/javascript-sdk'
import { PropertiesList } from './PropertiesList.tsx'

function App() {
  const [records, setRecords] = useState<CollectRecordsArrayResult>()
  const [users, setUsers] = useState<CollectSDKResult<typeof UserRepo.find>>()

  useEffect(() => {
    const find = async () => {
      const records = await Collect.records.find('CUSTOMER', {
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
        name: '1',
        email: 'test@example.com',
        id: 5,
        jobTitle: 'manager',
        age: 40,
        married: false
      },
      tx
    )

    await UserRepo.create(
      {
        name: '1',
        email: 'test@example.com',
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
    /*const users = */ await UserRepo.createMany([
      {
        name: '1',
        email: 'test@example.com',
        jobTitle: 'manager',
        age: 40,
        married: true
      },
      {
        name: '1',
        email: 'test@example.com',
        jobTitle: 'manager',
        age: 40,
        married: false
      }
    ])
    findUsers()
  }

  const findUsers = async () => {
    const users = await UserRepo.find({
      where: {
        jobTitle: ''
      },
      limit: 1000,
      orderBy: 'desc',
      skip: 0
    })

    const rels = await Collect.records.relations('018e9aed-51f1-7d6b-a6ad-0f178d920a4d')
    // const createRel = await Collect.records.detach('018e9aed-51f1-7d6b-a6ad-0f178d920a4d', [
    //   '018e9aed-51f1-7d6b-a6ad-0f147b57f7fd',
    //   '018e9aed-51f0-78bc-b8b8-84e021dfabad'
    // ])
    // const rels = await Collect.records.relations('018e9aa1-5c0c-7f59-9559-ec9068b8ccab')
    console.log(rels)
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
      <main>
        <PropertiesList />
      </main>
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
          {users?.data?.map(({ _collect_id, _collect_propsMetadata, _collect_label, ...user }) => (
            <div
              key={_collect_id}
              style={{ textAlign: 'left' }}
              className="card"
              data-_collect_propsMetadata={_collect_propsMetadata}
              data-_collect_label={_collect_label}
            >
              {Object.entries(user).map(([key, value]) => (
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
