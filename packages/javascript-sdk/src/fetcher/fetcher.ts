import { MakeRequestConfig } from './HttpClient.js'
import { CollectObjectApi } from '../types.js'

const defaultHeaders = {
  'Content-Type': 'application/json',
}

const buildUrl = (protocol: string, host: string, port: number | string, basePath: string): string => {
  // Ensure the basePath starts with a '/'
  if (basePath && !basePath.startsWith('/')) {
    basePath = '/' + basePath;
  }

  // If the port is the default for the protocol (80 for http, 443 for https), it can be omitted
  let portString = '';
  if (!((protocol === 'http' && port.toString() === "80") || (protocol === 'https' && port.toString() === "443"))) {
    portString = ':' + port;
  }

  return `${protocol}://${host}${portString}${basePath}`;
}

export const createFetcher =
  ({ token, httpClient, protocol, port, basePath, host }: CollectObjectApi) =>
  async <Data>(
    input: URL | string,
    { headers: initHeaders, ...init }: MakeRequestConfig
  ): Promise<Data> => {

    const url = buildUrl(protocol, host, port, basePath)
    const response = await httpClient.makeRequest(`${url}${input}`, {
      headers: {
        ...defaultHeaders,
        ...initHeaders,
        token
      },
      ...init
    })

    if (response.getStatusCode() >= 200 && response.getStatusCode() < 300 ) {
      const data = await response.toJSON()

      return data as Data
    }

    throw new Error(`${response.getStatusCode()}`)
  }
