export type RecordKeysByValueType<R extends Record<string, any>, T> = {
  [K in keyof R]: R[K] extends T ? K : never
}[keyof R]
export type Constructor<T, Args extends any[] = any[]> = new (...args: Args) => T
export type Callback<P extends any[] = [], R = void> = (...args: P) => R
export type MakeOptional<T extends Record<any, any>, K extends keyof T> = Partial<Pick<T, K>> & Required<Omit<T, K>>
export type MakeRequired<T extends Record<any, any>, K extends keyof T> = Partial<Omit<T, K>> & Required<Pick<T, K>>
