import type { Repository } from '@rattus-orm/core'

export const pullRepositoryKeys = [
  'save',
  'insert',
  'fresh',
  'destroy',
  'flush',
  'find',
  'all',
  'query',
] satisfies Array<keyof Repository>
