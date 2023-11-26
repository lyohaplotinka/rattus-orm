export type Constructor<T> = T extends { constructor: (...args: infer P) => any }
  ? {
      new (...args: P): T
    }
  : never
