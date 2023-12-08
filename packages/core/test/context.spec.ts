import { describe, expect, it } from 'vitest'
import { createRattusContext, RattusContext } from '../src/context/rattus-context'
import { ObjectDataProvider } from '../src/data/object-data-provider'
import { Database } from '../src'

describe('context.spec.ts', () => {
  it('createTestContext function returns correct context with default parameters', () => {
    const context = createRattusContext({ connection: 'entities' }, new ObjectDataProvider())

    expect(context).toBeInstanceOf(RattusContext)
    expect(context.$database.isStarted()).toEqual(true)
    expect(context.$database.getConnection()).toEqual('entities')
    expect(context.$databases).toStrictEqual({
      entities: context.$database,
    })
  })

  it('respects connection name', () => {
    const context = createRattusContext({ connection: 'custom' }, new ObjectDataProvider())
    expect(context.$database.getConnection()).toEqual('custom')
  })

  it('respects custom created database', () => {
    const db = new Database().setConnection('third')
    const context = createRattusContext({ database: db })

    expect(context.$database).toEqual(db)
    expect(context.$database.getConnection()).toEqual('third')
    expect(context.$databases).toEqual({
      third: db,
    })
    expect(context.$database.isStarted()).toEqual(false)
  })
})
