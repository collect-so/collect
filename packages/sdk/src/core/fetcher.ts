import type { HeadersInit, RequestInit } from 'node-fetch'

import fetch from 'node-fetch'
import { FetchError } from 'node-fetch'

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json'
}

type FetcherInit = {
  baseUrl: string
  token: string
}

export const createFetcher =
  ({ baseUrl, token }: FetcherInit) =>
  async <Data>(
    input: URL | string,
    { headers: initHeaders, ...init }: RequestInit = {}
  ): Promise<Data> => {
    const url = `${baseUrl}${input}`

    const response = await fetch(url, {
      headers: {
        ...defaultHeaders,
        ...initHeaders,
        token
      },
      ...init
    })

    if (response.ok) {
      const data = await response.json()

      return data as Data
    }

    throw new FetchError(response.statusText, response.type)
  }
