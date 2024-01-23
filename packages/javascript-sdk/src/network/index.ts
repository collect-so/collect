import type { HttpClient, MakeRequestConfig } from './HttpClient'

const defaultHeaders = {
  'Content-Type': 'application/json'
}

export const createFetcher =
  ({
    httpClient,
    token,
    url
  }: {
    httpClient: HttpClient
    token: string
    url: string
  }) =>
  async <Data>(
    input: URL | string,
    { headers: initHeaders, ...init }: MakeRequestConfig
  ): Promise<Data> => {
    const response = await httpClient.makeRequest(`${url}${input}`, {
      credentials: 'omit',
      headers: {
        ...defaultHeaders,
        ...initHeaders,

        token
      },
      ...init
    })

    if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
      const data = await response.toJSON()

      return data as Data
    }

    throw new Error(`${response.getStatusCode()}`)
  }
