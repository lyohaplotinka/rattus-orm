import { Model, Num, Repository, Str } from '../src'

export class TestUser extends Model {
  public static entity = 'testUser'

  @Str('')
  public declare id: string

  @Num(0)
  public declare age: number
}

export class TestUserCustomRepo extends Repository<TestUser> {
  public use = TestUser

  public getAllButCool() {
    return this.all()
  }
}
