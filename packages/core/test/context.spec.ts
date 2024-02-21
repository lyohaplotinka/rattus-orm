import { describe, expect, it } from 'vitest'
import { createRattusContext, RattusContext } from '../src/context/rattus-context'
import { ObjectDataProvider } from '../src/data/object-data-provider'
import { Database, Model, Repository, Str } from '../src'

class Email extends Model {
  public static entity = 'email'

  @Str('')
  public id: string
}

class EmailRepository extends Repository<Email> {
  public use = Email

  public getAllButCool() {
    return this.all()
  }
}

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
    const db = new Database().setConnection('third').setDataProvider(new ObjectDataProvider())
    const context = createRattusContext({ database: db })

    expect(context.$database).toEqual(db)
    expect(context.$database.getConnection()).toEqual('third')
    expect(context.$databases).toEqual({
      third: db,
    })
    expect(context.$database.isStarted()).toEqual(false)
  })

  it('$repo method allows retrieve custom repos', () => {
    const db = new Database()
      .setConnection('entities')
      .setDataProvider(new ObjectDataProvider())
      .registerCustomRepository(EmailRepository)
      .start()
    const context = createRattusContext({ database: db })

    const repo = context.$repo<EmailRepository>(Email)
    expect(repo).toBeInstanceOf(EmailRepository)
    expect(() => repo.getAllButCool()).not.toThrowError()
  })
})
