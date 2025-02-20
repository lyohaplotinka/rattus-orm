import { TestBed } from '@angular/core/testing'
import { describe, beforeEach, it, expect } from 'vitest'

import { RattusContextService } from '../src/context/rattus-context.service'
import { RattusOrmModule } from '../src/public-api'
import { RattusBehaviorSubject } from '../src/rxjs/rattus-behavior-subject'
import { RattusZodValidationPlugin } from '@rattus-orm/plugin-zod-validate'
import { TestUserNoCasting, TestUserNoCastingCustomRepo, TestDataProvider } from '@rattus-orm/core/utils/testUtils'
import { createDatabase, getDatabaseManager } from '@rattus-orm/core'

describe('RattusContextService', () => {
  beforeEach(() => {
    getDatabaseManager().clear()
  })

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
      const repo = service.getRepository(TestUserNoCasting)
      expect(typeof repo.observe).toBe('function')
      expect(repo.observe((r) => r.all())).toBeInstanceOf(RattusBehaviorSubject)
    })

    it('database.getRepository returns repository with "observe" method', () => {
      const repo = service.getDatabase().getRepository(TestUserNoCasting)
      expect(typeof repo.observe).toBe('function')
      expect(repo.observe((r) => r.all())).toBeInstanceOf(RattusBehaviorSubject)
    })
  })

  describe('custom settings', () => {
    it('respects custom connection', () => {
      TestBed.configureTestingModule(RattusOrmModule.forRoot({ connection: 'custom' }))
      const service = TestBed.inject(RattusContextService)

      expect(service.getDatabase().getConnection()).toEqual('custom')
    })

    it('respects custom database', () => {
      const database = createDatabase({ connection: 'third', dataProvider: new TestDataProvider() }).start()
      TestBed.configureTestingModule(RattusOrmModule.forRoot({ database }))
      const service = TestBed.inject(RattusContextService)

      expect(service.getDatabase().getConnection()).toEqual('third')
      expect(service.getDatabase().getDataProvider()).toBeInstanceOf(TestDataProvider)
    })

    it('respects custom repositories, they have observe method', () => {
      TestBed.configureTestingModule(RattusOrmModule.forRoot({ customRepositories: [TestUserNoCastingCustomRepo] }))
      const service = TestBed.inject(RattusContextService)
      const repo = service.getRepository<TestUserNoCastingCustomRepo>(TestUserNoCasting)

      expect(repo).toBeInstanceOf(TestUserNoCastingCustomRepo)
      expect(typeof repo.getAllButCool).toBe('function')
      expect(repo.observe((r) => r.all())).toBeInstanceOf(RattusBehaviorSubject)
    })

    it('respects plugins', () => {
      TestBed.configureTestingModule(
        RattusOrmModule.forRoot({ plugins: [RattusZodValidationPlugin({ strict: true })] }),
      )
      const service = TestBed.inject(RattusContextService)
      const repo = service.getRepository<TestUserNoCastingCustomRepo>(TestUserNoCasting)

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
