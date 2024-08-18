import { assertState, createStore, fillState } from '@func-test/utils/Helpers'

import { Model, Repository } from '@/index'
import { AttrField, NumberField, StringField } from '@/decorators'
import { TestingStore } from '@func-test/utils/types'
import { describe, expect } from 'vitest'

describe('feature/repository/update', () => {
  class User extends Model {
    static entity = 'users'

    @AttrField() id!: number
    @StringField('') name!: string
    @NumberField(0) age!: number
  }

  const getRepository = (store: TestingStore): Repository<User> => store.$repo(User)

  describe('update via repository method', () => {
    const prepareData = () => {
      const store = createStore()
      fillState(store, {
        users: {
          1: { id: 1, name: 'John Doe', age: 40 },
        },
      })
      return {
        store,
        repo: getRepository(store),
      }
    }

    it('updates record with partial data', () => {
      const { store, repo } = prepareData()
      repo.update({ id: 1, age: 25 })
      assertState(store, {
        users: {
          1: { id: 1, name: 'John Doe', age: 25 },
        },
      })
    })

    it('throws an error if there is no primary key in data', () => {
      const { repo } = prepareData()
      expect(() => repo.update({ name: 'John Doe', age: 20 })).toThrowError()
    })

    it('allows manually specify primary key value', () => {
      const { store, repo } = prepareData()
      repo.update(1, { age: 19 })
      assertState(store, {
        users: {
          1: { id: 1, name: 'John Doe', age: 19 },
        },
      })
    })

    it('allows batch updates', () => {
      const { store, repo } = prepareData()
      fillState(store, {
        users: {
          1: { id: 1, name: 'John Doe', age: 40 },
          2: { id: 2, name: 'Jane Doe', age: 30 },
          3: { id: 3, name: 'Johnny Doe', age: 20 },
        },
      })

      repo.update([
        { id: 1, age: 35 },
        { id: 3, age: 25 },
      ])
      assertState(store, {
        users: {
          1: { id: 1, name: 'John Doe', age: 35 },
          2: { id: 2, name: 'Jane Doe', age: 30 },
          3: { id: 3, name: 'Johnny Doe', age: 25 },
        },
      })
    })

    it('fail batch update if some records missing primary key', () => {
      const { store, repo } = prepareData()
      fillState(store, {
        users: {
          1: { id: 1, name: 'John Doe', age: 40 },
          2: { id: 2, name: 'Jane Doe', age: 30 },
          3: { id: 3, name: 'Johnny Doe', age: 20 },
        },
      })

      expect(() =>
        repo.update([
          { id: 1, age: 35 },
          { name: 'Johnny Doe', age: 25 },
        ]),
      ).toThrowError()

      assertState(store, {
        users: {
          1: { id: 1, name: 'John Doe', age: 40 },
          2: { id: 2, name: 'Jane Doe', age: 30 },
          3: { id: 3, name: 'Johnny Doe', age: 20 },
        },
      })
    })
  })

  describe('update via query method', () => {
    it('updates a record specified by the query chain', () => {
      const store = createStore()

      fillState(store, {
        users: {
          1: { id: 1, name: 'John Doe', age: 40 },
          2: { id: 2, name: 'Jane Doe', age: 30 },
          3: { id: 3, name: 'Johnny Doe', age: 20 },
        },
      })

      store.$repo(User).where('name', 'Jane Doe').update({ age: 50 })

      assertState(store, {
        users: {
          1: { id: 1, name: 'John Doe', age: 40 },
          2: { id: 2, name: 'Jane Doe', age: 50 },
          3: { id: 3, name: 'Johnny Doe', age: 20 },
        },
      })
    })

    it('updates multiple records specified by the query chain', () => {
      const store = createStore()

      fillState(store, {
        users: {
          1: { id: 1, name: 'John Doe', age: 40 },
          2: { id: 2, name: 'Jane Doe', age: 30 },
          3: { id: 3, name: 'Johnny Doe', age: 20 },
        },
      })

      store.$repo(User).where('name', 'Jane Doe').orWhere('age', 20).update({ age: 50 })

      assertState(store, {
        users: {
          1: { id: 1, name: 'John Doe', age: 40 },
          2: { id: 2, name: 'Jane Doe', age: 50 },
          3: { id: 3, name: 'Johnny Doe', age: 50 },
        },
      })
    })

    it('returns an empty array if there are no matching records', () => {
      const store = createStore()

      fillState(store, {
        users: {
          1: { id: 1, name: 'John Doe', age: 40 },
          2: { id: 2, name: 'Jane Doe', age: 30 },
          3: { id: 3, name: 'Johnny Doe', age: 20 },
        },
      })

      const users = store.$repo(User).where('name', 'No match').update({ age: 50 })

      expect(users).toEqual([])

      assertState(store, {
        users: {
          1: { id: 1, name: 'John Doe', age: 40 },
          2: { id: 2, name: 'Jane Doe', age: 30 },
          3: { id: 3, name: 'Johnny Doe', age: 20 },
        },
      })
    })
  })
})
