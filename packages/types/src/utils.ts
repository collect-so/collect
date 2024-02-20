export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>
}[keyof T]

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = {
  [K in Keys]: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, never>>
}[Keys]

export type Enumerable<T> = Array<T> | T

export type FlattenTypes<T> = T extends object
  ? { [K in keyof T]: FlattenTypes<T[K]> }
  : T
