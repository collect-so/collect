import fetch, { Response } from 'node-fetch'
import { number, object, string } from 'yup'

import { createCollect } from '../src/core/sdk'
import { NodeHttpClient } from '../src/fetcher/NodeHttpClient'


const mockedFetch = fetch as jest.MockedFunction<typeof fetch>
const Collect = createCollect(new NodeHttpClient())
// @ts-ignore
const collect = new Collect('123')

describe(`Collect`, () => {
  describe('implementation', () => {
    it('is chainable', async () => {

      mockedFetch.mockResolvedValue(
        new Response({
          id: 1,
          title: 'Forrest Gump',
          year: '1994'
        })
      )
      const record = await collect.create('Movie', {
        title: 'Forrest Gump',
        year: '1994'
      })
      const { data } = await record.update(
        { id: 1 },
        {
          ...record.data,
          year: '1994'
        }
      )
      expect(data).toEqual({
        id: 1,
        title: 'Forrest Gump',
        year: '1994'
      })
    })
  })
  describe('validation', () => {
    it('validates by label', async () => {

      collect.registerModel(
        'Movie',
        object({
          title: string(),
          year: number()
        })
      )
      mockedFetch.mockResolvedValueOnce(
        new Response({
          id: 1,
          title: 'Forrest Gump',
          year: '1994'
        })
      )
      await expect(async () => {
        await collect.update(
          'Movie',
          {},
          { title: 'Forrest Gump', year: '1994ad' }
        )
      }).rejects.toThrowError(
        'year must be a `number` type, but the final value was: `NaN` (cast from the value `"1994ad"`).'
      )
    })
    it('validates by model param', async () => {

      collect.registerModel(
        'Movie',
        object({
          title: string(),
          year: number()
        })
      )
      await expect(async () => {
        await collect.create(
          object({
            title: string(),
            year: number().test(
              'len',
              'Must be exactly 5 characters',
              (val) => val?.toString().length === 4
            )
          }),
          {
            title: 'Forrest Gump',
            year: '199'
          }
        )
      }).rejects.toThrow('Must be exactly 5 characters')
    })
    it(`doesn't validate without label`, async () => {
      collect.registerModel(
        'Movie',
        object({
          title: string(),
          year: number()
        })
      )
      await expect(async () => {
        await collect.create({
          title: 'Forrest Gump',
          year: '1994asd'
        })
      }).not.toThrow()
    })
    it(`validation doesn't break after chaining`, async () => {
      collect.registerModel(
        'Movie',
        object({
          title: string(),
          year: number()
        })
      )
      await expect(async () => {
        const movie = await collect.create('Movie', {
          title: 'Forrest Gump',
          year: '1994'
        })
        await movie.create('Movie', {
          title: 'Forrest Gump 2',
          year: 'lol'
        })
      }).rejects.toThrow()
    })
  })
  describe('creating records', () => {
    it('creates record by id', async () => {
      const response1 = {
        id: 1,
        title: 'Forrest Gump',
        year: '1994'
      }
      mockedFetch.mockResolvedValueOnce(new Response(response1))
      const { data: data1 } = await collect.create('Movie', {
        title: 'Forrest Gump',
        year: '1994'
      })
      expect(mockedFetch).toHaveBeenLastCalledWith(expect.anything(), {
        body: JSON.stringify({
          label: 'Movie',
          properties: [
            { name: 'title', type: 'string', value: 'Forrest Gump' },
            { name: 'year', type: 'number', value: '1994' }
          ]
        }),
        headers: expect.anything(),
        method: expect.anything()
      })
      expect(data1).toEqual(response1)
      const response2 = {
        id: 2,
        title: 'The Godfather',
        year: '1972'
      }
      mockedFetch.mockResolvedValueOnce(new Response(response2))
      const { data: data2 } = await collect.create('Movie', {
        title: 'The Godfather',
        year: '1972'
      })
      expect(mockedFetch).toHaveBeenLastCalledWith(expect.anything(), {
        body: JSON.stringify({
          label: 'Movie',
          properties: [
            { name: 'title', type: 'string', value: 'The Godfather' },
            { name: 'year', type: 'number', value: '1972' }
          ]
        }),
        headers: expect.anything(),
        method: expect.anything()
      })
      expect(data1).toEqual(response1)
      expect(data2).toEqual(response2)
    })
    it('infers validation schema after create method', async () => {
      await expect(async () => {
        const movie = await collect.create('Movie', {
          title: 'Forrest Gump',
          year: '1994'
        })
        await movie.update({}, { title: 'Forrest Gump', year: '1994ad' })
      }).rejects.toThrowError(
        'year must be a `number` type, but the final value was: `NaN` (cast from the value `"1994ad"`).'
      )
    })
  })
  describe('updating records', () => {
    it('updates record by id', async () => {
      const response = {
        name: 'Forrest Gump',
        rating: 9
      }
      mockedFetch.mockResolvedValueOnce(new Response(response))
      const { data } = await collect.update(
        'Movie',
        { id: 1 },
        {
          rating: 9
        }
      )
      expect(mockedFetch).toHaveBeenLastCalledWith(expect.anything(), {
        body: JSON.stringify({
          label: 'Movie',
          properties: [{ name: 'rating', type: 'number', value: 9 }]
        }),
        headers: expect.anything(),
        method: expect.anything()
      })
      expect(data).toEqual(response)
    })
  })
  describe('linking records', () => {
    it('links by id', async () => {
      const response = {
        id: 1,
        name: 'Forrest Gump',
        rating: 9
      }
      mockedFetch.mockResolvedValueOnce(new Response(response))
      const movie = await collect.create('Movie', {
        name: 'Forrest Gump',
        rating: 9
      })
      await movie.link({
        id: 3
      })
      expect(mockedFetch).toHaveBeenLastCalledWith(
        expect.stringMatching(/1$/),
        {
          body: JSON.stringify({
            id: 3
          }),
          headers: expect.anything(),
          method: expect.anything()
        }
      )
    })
    it('links another instance', async () => {
      mockedFetch.mockResolvedValueOnce(
        new Response({
          id: 'movieId',
          name: 'Forrest Gump'
        })
      )
      const movie = await collect.create('Movie', {
        name: 'Forrest Gump'
      })
      mockedFetch.mockResolvedValueOnce(
        new Response({
          id: 'ratingId',
          value: 9
        })
      )
      const rating = await collect.create('Rating', {
        value: 9
      })
      await movie.link(rating)
      expect(mockedFetch).toHaveBeenLastCalledWith(
        expect.stringMatching(/movieId$/),
        {
          body: JSON.stringify({
            targetIds: ['ratingId']
          }),
          headers: expect.anything(),
          method: expect.anything()
        }
      )
    })
    it('links to array', async () => {
      mockedFetch.mockResolvedValueOnce(
        new Response({
          id: 'movieId',
          name: 'Forrest Gump'
        })
      )
      const movie = await collect.create('Movie', {
        name: 'Forrest Gump'
      })
      mockedFetch.mockResolvedValueOnce(
        new Response({
          id: 'ratingId',
          value: 9
        })
      )
      const rating = await collect.create('Rating', {
        value: 9
      })
      mockedFetch.mockResolvedValueOnce(
        new Response({
          comment: 'This is my favourite movie to date',
          id: 'reviewId'
        })
      )
      const review = await collect.create('Rating', {
        comment: 'This is my favourite movie to date'
      })
      await movie.link([rating, review])
      expect(mockedFetch).toHaveBeenCalledWith(
        expect.stringMatching(/movieId$/),
        {
          body: JSON.stringify({
            targetIds: ['ratingId', 'reviewId']
          }),
          headers: expect.anything(),
          method: expect.anything()
        }
      )
    })
  })
})
