import { describe, expect } from 'vitest'
import { TestUser } from '../shared-utils/testUtils'
import { createDatabase } from '../src'
import { EventsDataProviderWrapper } from '../src/events/events-data-provider-wrapper'
import { ObjectDataProvider } from '../src/object-data-provider'

describe('database', () => {
  it('getDataProvider returns user-set data provider, not wrapped one', () => {
    const db = createDatabase({ dataProvider: new ObjectDataProvider() }).start()

    expect(db.getDataProvider()).toBeInstanceOf(ObjectDataProvider)
    expect(db.getDataProvider()).not.toBeInstanceOf(EventsDataProviderWrapper)
  })

  it('dump works correctly', () => {
    const dp = new ObjectDataProvider()

    const dbOne = createDatabase({ dataProvider: dp, connection: 'one' }).start()
    dbOne.getRepository(TestUser).save({ id: '1', age: 20 })

    const dbTwo = createDatabase({ dataProvider: dp, connection: 'two' }).start()
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
    const dbOne = createDatabase({ dataProvider: dp, connection: 'one' }).start()

    dbOne.restore({ one: { testUser: { data: { '1': { id: '1', age: 20 } } } } })
    expect(dbOne.getRepository(TestUser).find('1')?.$toJson()).toStrictEqual({ id: '1', age: 20 })
  })
})
