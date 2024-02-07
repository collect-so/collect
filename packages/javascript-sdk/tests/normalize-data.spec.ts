import { normalizeData } from '../src/common/utils/utils.js'

describe(`normalize data`, () => {
  it('suggests correct types for non-array values', () => {
    expect(
      normalizeData({
        date: '2023-12-09T12:33:33',
        hasJob: true,
        name: 'Bob',
        year: '1997'
      })
    ).toEqual([
      {
        name: 'date',
        type: 'datetime',
        value: '2023-12-09T12:33:33'
      },
      {
        name: 'hasJob',
        type: 'boolean',
        value: true
      },
      {
        name: 'name',
        type: 'string',
        value: 'Bob'
      },
      {
        name: 'year',
        type: 'number',
        value: '1997'
      }
    ])
  })

  it('suggests correct types for array values', () => {
    expect(
      normalizeData({
        date: ['2023-12-09T12:33:33'],
        hasJob: [true],
        name: ['Bob'],
        year: ['1997']
      })
    ).toEqual([
      {
        name: 'date',
        type: 'datetime',
        value: ['2023-12-09T12:33:33']
      },
      {
        name: 'hasJob',
        type: 'boolean',
        value: [true]
      },
      {
        name: 'name',
        type: 'string',
        value: ['Bob']
      },
      {
        name: 'year',
        type: 'number',
        value: ['1997']
      }
    ])

    // mixed arrays
    expect(
      normalizeData({
        date: ['2023-12-09T12:33:33', 123],
        hasJob: [true, 123],
        name: ['Bob', 3],
        year: ['1997', 'asd']
      })
    ).toEqual([
      {
        name: 'date',
        type: 'string',
        value: ['2023-12-09T12:33:33', 123]
      },
      {
        name: 'hasJob',
        type: 'string',
        value: [true, 123]
      },
      {
        name: 'name',
        type: 'string',
        value: ['Bob', 3]
      },
      {
        name: 'year',
        type: 'string',
        value: ['1997', 'asd']
      }
    ])
  })
})
