export type RecordKeysByValueType<R extends Record<string, any>, T> = {
  [K in keyof R]: R[K] extends T ? K : never
}[keyof R]
