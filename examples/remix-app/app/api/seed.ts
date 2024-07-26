import { AuthorRepo, Collect, CommentRepo } from './index'
import { type CollectTransaction } from '@collect.so/javascript-sdk'

export const creteAuthors = async (tx: CollectTransaction) => {
  return await AuthorRepo.createMany(
    [
      {
        name: 'John',
        email: 'test1@example.com'
      },
      {
        name: 'Marie',
        email: 'test2@example.com'
      },
      {
        name: 'Sam',
        email: 'test3@example.com1'
      }
    ],
    tx
  )
}

const createComments = async (tx: CollectTransaction) => {
  return await CommentRepo.createMany(
    [
      {
        text: 'abc'
      },
      {
        text: 'cde'
      },
      {
        text: 'efg'
      }
    ],
    tx
  )
}

export const seed = async () => {
  const tx = await Collect.tx.begin({ ttl: 5000 })

  const [comments, authors] = await Promise.all([createComments(tx), creteAuthors(tx)])
  await Promise.all(authors.data.map((a, i) => Collect.toInstance(a).attach(comments.data[i], tx)))

  await tx.commit()
}
