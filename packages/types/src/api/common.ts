export type CollectApiResponse<T, P = Record<string, any>> = {
  data: T
  success: boolean
} & P
