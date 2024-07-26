import CollectSDK, { CollectModel, CollectQuery } from '@collect.so/javascript-sdk'

export const Collect = new CollectSDK(
  '4fe44debe9efe8845c1318863d6f07297x974ilf2h3qM62/Ci3iu4D5GFhMuzHk7Nulop8Yr4g8CJ5YUIONhNsbx0pv7RT0',
  {
    url: 'http://localhost'
  }
)

const asyncRandomNumber = async () =>
  await new Promise<number>((resolve) => {
    setTimeout(() => resolve(Math.random()), 150)
  })

export const UserRepo = new CollectModel(
  'user',
  {
    name: { type: 'string' },
    email: { type: 'string', uniq: true },
    id: { type: 'number', default: asyncRandomNumber },
    jobTitle: { type: 'string', multiple: true },
    age: { type: 'number' },
    married: { type: 'boolean' },
    dateOfBirth: { type: 'datetime', default: () => new Date().toISOString() }
  },
  Collect
)

export const PostRepo = new CollectModel(
  'post',
  {
    created: { type: 'datetime', default: () => new Date().toISOString() },
    title: { type: 'string' },
    content: { type: 'string' },
    rating: { type: 'number' }
  },
  Collect
)

export const AuthorRepo = new CollectModel(
  'author',
  {
    name: { type: 'string' },
    email: { type: 'string', uniq: true }
  },
  Collect
)

export const CommentRepo = new CollectModel(
  'comment',
  {
    authoredBy: { type: 'string', required: false },
    text: { type: 'string' }
  },
  Collect
)

export type Models = {
  author: typeof AuthorRepo.schema
  post: typeof PostRepo.schema
  comment: typeof CommentRepo.schema
}
export const findTest = async () => {
  await Collect.records.find('', {
    where: {
      name: '',
      post: {
        content: '',
        comment: { text: '' }
      }
    },
    labels: ['author']
  })

  await AuthorRepo.find({
    where: {
      name: '',
      email: {
        $startsWith: '113'
      },
      post: {
        created: '',
        rating: 1,
        comment: {
          text: '',
          authoredBy: ''
        }
      }
    }
  })

  await AuthorRepo.find({
    where: {
      post: {
        created: {
          $year: 1994
        },
        comment: {
          authoredBy: ''
        }
      }
    }
  })

  await AuthorRepo.find({ where: { name: '' } })

  await PostRepo.find({
    where: {
      title: { $startsWith: '' }
    }
  })

  await UserRepo.find({
    where: {
      email: { $startsWith: '' },
      married: { $ne: false },
      age: { $nor: [{ $or: [4, 5, { $gte: 4 }] }, { $and: [4, 5, { $gte: 4 }] }], $gte: 5 }
    }
  })
}

export const recursiveSearch: CollectQuery = {
  where: {
    name: {
      $startsWith: 'Jack',
      $endsWith: 'Rooney'
    },
    dateOfBirth: {
      $year: 1984
    },
    POST: {
      created: {
        $year: 2011,
        $month: 11,
        $day: 11
      },
      rating: {
        $gte: 4.5
      },
      title: {
        $ne: 'Forest'
      },
      COMMENT: {
        $relation: { direction: 'in', type: 'HAS_COMMENT' },
        authoredBy: {
          $contains: 'Sam'
        }
      }
    }
  }
}
