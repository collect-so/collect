import CollectSDK, { CollectModel } from '@collect.so/javascript-sdk'

export const Collect = new CollectSDK(
  '01da9f307ae13a24bd07c309a4b0effdywhrC2H4YL25FUDu2i511G2mbEUnrBNQ7sng/tCCEAVTLuCDMPxYrg1rA99deHsQ',
  {
    url: 'http://localhost'
  }
)

const asyncRandomNumber = async () =>
  await new Promise<number>((resolve) => {
    setTimeout(() => resolve(Math.random()), 150)
  })

const User = new CollectModel('user', {
  name: { type: 'string' },
  email: { type: 'string', uniq: true },
  id: { type: 'number', default: asyncRandomNumber },
  jobTitle: { type: 'string' },
  age: { type: 'number' },
  married: { type: 'boolean' },
  dateOfBirth: { type: 'datetime', default: () => new Date().toISOString() }
})

export const UserRepo = Collect.registerModel(User)

//

export const Post = new CollectModel('post', {
  created: { type: 'datetime', default: () => new Date().toISOString() },
  title: { type: 'string' },
  content: { type: 'string' }
})

export const Author = new CollectModel('author', {
  name: { type: 'string' },
  email: { type: 'string', uniq: true }
})

export const Comment = new CollectModel('comment', {
  authoredBy: { type: 'string' },
  text: { type: 'string' }
})

export const AuthorRepo = Collect.registerModel(Author)
export const PostRepo = Collect.registerModel(Post)
export const CommentRepo = Collect.registerModel(Comment)

export type Models = {
  author: typeof Author.schema
  post: typeof Post.schema
  comment: typeof Comment.schema
}
export const findTest = async () => {
  await Collect.records.find<{ name: string }>({
    where: {
      name: '',
      post: {
        content: ''
      }
    },
    labels: ['author']
  })

  await AuthorRepo.find({
    where: {
      name: '',
      post: {
        created: '',
        title: '',
        comment: {
          authoredBy: ''
        }
      }
    }
  })

  await PostRepo.find({
    where: {
      title: { startsWith: '' }
    }
  })

  await UserRepo.find({
    where: {
      email: { startsWith: '' },
      married: { not: false }
    }
  })
}
