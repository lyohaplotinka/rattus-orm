import { describe, expect } from 'vitest'
import { createDatabase, Model, Repository, Str } from '../src'
import { ObjectDataProvider } from '../src/data/object-data-provider'

class User extends Model {
  public static entity = 'user'

  @Str('')
  public id: string
}

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

const createDb = () => {
  return createDatabase({
    dataProvider: new ObjectDataProvider(),
    customRepositories: [EmailRepository],
  }).start()
}

describe('custom-repositories', () => {
  it('default repository if no custom repository registered', () => {
    const db = createDb()
    expect(db.getRepository(User)).toBeInstanceOf(Repository)
    expect(db.getRepository(User)).not.toBeInstanceOf(EmailRepository)
  })

  it('custom repository if custom repository registered', () => {
    const repo = createDb().getRepository<EmailRepository>(Email)
    expect(repo).toBeInstanceOf(EmailRepository)

    // Need for type test reasons
    expect(() => repo.getAllButCool()).not.toThrowError()
  })
})
