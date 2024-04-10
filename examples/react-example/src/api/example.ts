import type {
  CollectQuery,
  CollectQueryCommonParams,
  CollectSchema
} from '@collect.so/javascript-sdk'

type User = {
  age: number
  birthday: string
  favoriteFood: string
  favoriteNumber: number
  height: number
  id: number
  married: boolean
  name: string
  otherDate: string
  registeredAt: string
  secondCitizenship: null
  weight: number
}

const userSchema: CollectSchema = {
  age: { type: 'number' },
  dateOfBirth: { required: false, type: 'datetime' },
  favoriteFood: { type: 'string' },
  favoriteNumber: { type: 'number' },
  height: { type: 'number' },
  id: { type: 'number' },
  jobTitle: { type: 'string' },
  married: { type: 'boolean' },
  name: { type: 'string' },
  otherDate: { required: false, type: 'datetime' },
  registeredAt: { required: false, type: 'datetime' },
  secondCitizenship: { required: false, type: 'null' },
  weight: { required: false, type: 'number' }
} as const

const queryCommonParams: CollectQueryCommonParams<User> = {
  limit: 1000,
  orderBy: {
    age: 'desc',
    favoriteNumber: 'asc'
  },
  skip: 0
}
// Example usage:
export const a: CollectQuery = {
  where: {
    name: 'Post author name',
    post: {
      // This "post" is considered a relation
      comment: {
        // Nested relation
        text: { $startsWith: 'Neo4j' }
      }
    }
  }
}
// posts.comment.text *. "Neo4j"
export const q1: CollectQuery<typeof userSchema> = {
  ...queryCommonParams,
  where: {
    age: '12',
    dateOfBirth: {
      $day: 28,
      $month: 1,
      $year: 1994
    },
    favoriteFood: {
      $in: ['pasta', 'pho bo', 'pad thai']
    },
    favoriteNumber: {
      $notIn: [5, 6, 7]
    },
    height: {
      $gte: 173,
      $lte: 175
    },
    id: {
      $in: [1, 2, 3],
      $not: 0,
      $notIn: [4, 5]
    },
    married: true,
    name: {
      $contains: 'em',
      $endsWith: 'iy',
      $startsWith: 'Art'
    },
    otherDate: {
      $lt: {
        $day: 28,
        $month: 1,
        $year: 1994
      }
    },
    registeredAt: '24-02-2023T12:45:11+01:00',
    secondCitizenship: null,
    weight: {
      $gt: 80,
      $lt: 90
    }
  }
}

export const q2: CollectQuery<User> = {
  ...queryCommonParams,
  where: {
    $AND: [
      {
        id: {
          $in: [1, 2, 3],
          $not: 0,
          $notIn: [4, 5]
        }
      }
    ]
  }
}

// COMBINATION
export const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

// GET (>=2 AND <=4) AND (>6 AND <8) AND (0)
export const variant1: CollectQuery<User> = {
  where: {
    $AND: [
      {
        id: {
          $gte: 2,
          $lt: 1,
          $lte: 4
        }
      },
      {
        id: {
          $gt: 6,
          $lt: 8
        }
      },
      { id: 0 }
    ]
  }
}

// GET (>=2 AND <=4) OR (>6 AND <8) OR (0)
export const variant2: CollectQuery<User> = {
  where: {
    $OR: [
      {
        id: {
          $gte: 2,
          $lte: 4
        }
      },
      {
        id: {
          $gt: 6,
          $lt: 8
        }
      },
      { id: 0 }
    ]
  }
}

// GET (>=2 AND <=4) AND (>6 AND <8) OR (0)
export const variant3: CollectQuery<User> = {
  where: {
    $AND: [
      {
        id: {
          $gte: 2,
          $lte: 4
        }
      },
      {
        id: {
          $gt: 6,
          $lt: 8
        }
      }
    ],
    $OR: { id: 0 }
  }
}
