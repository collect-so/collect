import { useEffect, useState } from 'react'
import { Collect, CommentRepo, UserRepo } from '~/api'
import { PropertiesList } from '~/components/PropertiesList'
import { CollectRecordsArrayInstance } from '@collect.so/javascript-sdk'

export const App = () => {
  const [records, setRecords] = useState<CollectRecordsArrayInstance>()
  const [users, setUsers] = useState<CollectRecordsArrayInstance<(typeof UserRepo)['schema']>>()

  // useEffect(() => {
  //   const find = async () => {
  //     const records = await Collect.records.find('associatedDrug', recursiveSearch)
  //
  //     setRecords(records)
  //   }
  //   find()
  // }, [])

  const createUser = async () => {
    const tx = await Collect.tx.begin({ ttl: 5000 })

    await UserRepo.create(
      {
        name: '1',
        email: 'test@example1.com',
        id: 5,
        jobTitle: ['manager'],
        age: 40,
        married: false
      },
      tx
    )

    await UserRepo.create(
      {
        name: '2',
        email: 'test@example.com',
        id: 6,
        jobTitle: ['teamlead', 'programmer'],
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
        name: '1',
        email: 'test@example.com',
        jobTitle: ['manager'],
        age: 40,
        married: true
      },
      {
        name: '1',
        email: 'test@example.com',
        jobTitle: ['manager'],
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

    setUsers(users)
  }

  useEffect(() => {
    // findUsers()
    // seed()
  }, [])

  const deleteAuthorByComment = async () => {
    await CommentRepo.delete({
      where: {
        // __id: '0190d540-7fe9-76b3-a28c-1c38c7691b1a',
        author: {
          __id: '0190d540-7ffe-73a4-af5b-7eb68346dc28'
        }
      }
    })
  }

  return (
    <>
      <header>
        <button onClick={createUser}>create user</button>
        <button onClick={createMultipleUsers}>create multiple users</button>
        <button onClick={deleteAuthorByComment}>deleteAuthorByComment</button>
      </header>
      <main>
        <PropertiesList />
      </main>
      <div style={{ display: 'flex' }}>
        <div>
          <p>Data</p>
          <ol style={{ fontFamily: 'monospace' }}>
            {records?.data?.map(({ __id, __label }, index) => (
              <li key={`${__id}-${index}`}>
                {__label}: {__id}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div>
        <p>Users</p>
        <div style={{ display: 'grid' }}>
          {users?.data?.map(({ __id, __proptypes, __label, ...user }) => (
            <div
              key={__id}
              style={{ textAlign: 'left' }}
              className="card"
              data-__proptypes={__proptypes}
              data-__label={__label}
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
