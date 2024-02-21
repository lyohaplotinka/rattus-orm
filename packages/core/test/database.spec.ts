import { describe, expect } from 'vitest'
import { Database } from '../src'
import { ObjectDataProvider } from '../src/object-data-provider'
import { EventsDataProviderWrapper } from '../src/events/events-data-provider-wrapper'
import { TestUser } from '../shared-utils/testUtils'

describe('database', () => {
  it('getDataProvider returns user-set data provider, not wrapped one', () => {
    const db = new Database().setDataProvider(new ObjectDataProvider()).setConnection('entities').start()

    expect(db.getDataProvider()).toBeInstanceOf(ObjectDataProvider)
    expect(db.getDataProvider()).not.toBeInstanceOf(EventsDataProviderWrapper)
  })

  it('dump works correctly', () => {
    const dp = new ObjectDataProvider()

    const dbOne = new Database().setDataProvider(dp).setConnection('one').start()
    dbOne.getRepository(TestUser).save({ id: '1', age: 20 })

    const dbTwo = new Database().setDataProvider(dp).setConnection('two').start()
    dbTwo.getRepository(TestUser).save({ id: '1', age: 30 })

    expect(dbOne.dump()).toStrictEqual({
      one: {
        testUser: {
          data: {
            '1': {
              id: '1',
              age: 20,
            },
          },
        },
      },
    })

    expect(dbTwo.dump()).toStrictEqual({
      two: {
        testUser: {
          data: {
            '1': {
              id: '1',
              age: 30,
            },
          },
        },
      },
    })
  })

  it('restore works correctly', () => {
    const dp = new ObjectDataProvider()
    const dbOne = new Database().setDataProvider(dp).setConnection('one').start()

    dbOne.restore({ one: { testUser: { data: { '1': { id: '1', age: 20 } } } } })
    expect(dbOne.getRepository(TestUser).find('1')?.$toJson()).toStrictEqual({ id: '1', age: 20 })
  })
})
