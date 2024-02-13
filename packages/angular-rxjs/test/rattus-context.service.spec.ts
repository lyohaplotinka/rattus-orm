import { TestBed } from '@angular/core/testing'
import { describe, beforeEach, it, expect } from 'vitest'

import { RattusContextService } from '../src/context/rattus-context.service'
import { Model, Repository, Str } from '@rattus-orm/core'
import { RattusOrmModule } from '../src/public-api'
import { RattusBehaviorSubject } from '../src/rxjs/rattus-behavior-subject'
import { Database } from '@rattus-orm/core'
import { ObjectDataProvider } from '@rattus-orm/core/object-data-provider'
import { RattusZodValidationPlugin } from '@rattus-orm/plugin-zod-validate'

class CustomDataProvider extends ObjectDataProvider {}

class User extends Model {
  public static override entity = 'user'
  public static override dataTypeCasting = false

  @Str('')
  declare id: string

  @Str('')
  declare email: string
}

describe('RattusContextService', () => {
  describe('basic', () => {
    let service: RattusContextService

    beforeEach(() => {
      TestBed.configureTestingModule(RattusOrmModule.forRoot())
      service = TestBed.inject(RattusContextService)
    })

    it('should be created', () => {
      expect(service).toBeTruthy()
    })

    it('getRepository returns repository with "observe" method', () => {
      const repo = service.getRepository(User)
      expect(typeof repo.observe).toBe('function')
      expect(repo.observe((r) => r.all())).toBeInstanceOf(RattusBehaviorSubject)
    })

    it('database.getRepository returns repository with "observe" method', () => {
      const repo = service.getDatabase().getRepository(User)
      expect(typeof repo.observe).toBe('function')
      expect(repo.observe((r) => r.all())).toBeInstanceOf(RattusBehaviorSubject)
    })
  })

  describe('custom settings', () => {
    class UserCustomRepo extends Repository {
      public override use = User

      public getAllButCool() {
        return this.all()
      }
    }

    it('respects custom connection', () => {
      TestBed.configureTestingModule(RattusOrmModule.forRoot({ connection: 'custom' }))
      const service = TestBed.inject(RattusContextService)

      expect(service.getDatabase().getConnection()).toEqual('custom')
    })

    it('respects custom database', () => {
      const database = new Database().setConnection('third').setDataProvider(new CustomDataProvider()).start()
      TestBed.configureTestingModule(RattusOrmModule.forRoot({ database }))
      const service = TestBed.inject(RattusContextService)

      expect(service.getDatabase().getConnection()).toEqual('third')
      expect((service.getDatabase().getDataProvider() as any).provider).toBeInstanceOf(CustomDataProvider)
    })

    it('respects custom repositories, they have observe method', () => {
      TestBed.configureTestingModule(RattusOrmModule.forRoot({ customRepositories: [UserCustomRepo] }))
      const service = TestBed.inject(RattusContextService)
      const repo = service.getRepository<UserCustomRepo>(User)

      expect(repo).toBeInstanceOf(UserCustomRepo)
      expect(typeof repo.getAllButCool).toBe('function')
      expect(repo.observe((r) => r.all())).toBeInstanceOf(RattusBehaviorSubject)
    })

    it('respects plugins', () => {
      TestBed.configureTestingModule(
        RattusOrmModule.forRoot({ plugins: [RattusZodValidationPlugin({ strict: true })] }),
      )
      const service = TestBed.inject(RattusContextService)
      const repo = service.getRepository<UserCustomRepo>(User)

      try {
        repo.insert({ id: 1, email: 'test' })
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.name)
          expect(e.name).toEqual('RattusZodValidationError')
        } else {
          throw new Error('not an error')
        }
      }
    })
  })
})
