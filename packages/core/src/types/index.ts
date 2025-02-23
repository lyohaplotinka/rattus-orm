export type RecordKeysByValueType<R extends Record<string, any>, T> = {
  [K in keyof R]: R[K] extends T ? K : never
}[keyof R]
export type Constructor<T, Arguments extends unknown[] = any[]> = new (
  ...arguments_: Arguments
) => T
export type Callback<P extends any[] = [], R = void> = (...args: P) => R
export type MakeOptional<T extends Record<any, any>, K extends keyof T> = Partial<Pick<T, K>> &
  Required<Omit<T, K>>
export type MakeRequired<T extends Record<any, any>, K extends keyof T> = Partial<Omit<T, K>> &
  Required<Pick<T, K>>

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never
type UnionToOvlds<U> = UnionToIntersection<U extends any ? (f: U) => void : never>
type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true
export type UnionToArray<T, A extends unknown[] = []> = IsUnion<T> extends true
  ? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
  : [T, ...A]
