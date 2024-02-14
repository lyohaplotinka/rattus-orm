import { beforeEach, describe, expect, it } from 'vitest'
import { Item, Model, Str } from '@rattus-orm/core'
import { TestBed } from '@angular/core/testing'
import { RattusOrmModule, RattusContextService } from '../src/public-api'
import { Component } from '@angular/core'
import { AsyncPipe } from '@angular/common'
import { BehaviorSubject } from 'rxjs'

class User extends Model {
  public static override entity = 'user'
  public static override dataTypeCasting = false

  @Str('')
  declare id: string

  @Str('')
  declare email: string
}

@Component({
  standalone: true,
  selector: 'test-component',
  template: '<div class="id">{{ (user | async)?.id }}</div><div class="email">{{ (user | async)?.email }}</div>',
  imports: [AsyncPipe],
})
export class TestComponent {
  public user: BehaviorSubject<Item<User>>

  constructor(protected readonly contextService: RattusContextService) {
    this.user = this.getUserRepository().observe((repo) => repo.query().where('id', '1').first())
  }

  public getUserRepository() {
    return this.contextService.getRepository(User)
  }
}

describe('angular: reactivity', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(RattusOrmModule.forRoot())
    TestBed.inject(RattusContextService).getRepository(User).save({ id: '1', email: 'test@test.com' })
  })

  it('renders component with initial data', () => {
    const fixture = TestBed.createComponent(TestComponent)
    fixture.detectChanges()

    expect(fixture.nativeElement.querySelector('.id').innerHTML).toEqual('1')
    expect(fixture.nativeElement.querySelector('.email').innerHTML).toEqual('test@test.com')
  })

  it('data reactively changes', () => {
    const fixture = TestBed.createComponent(TestComponent)
    fixture.detectChanges()

    expect(fixture.nativeElement.querySelector('.id').innerHTML).toEqual('1')
    expect(fixture.nativeElement.querySelector('.email').innerHTML).toEqual('test@test.com')

    fixture.componentInstance.getUserRepository().save({ id: '1', email: 'changed@test.com' })
    fixture.detectChanges()

    expect(fixture.nativeElement.querySelector('.id').innerHTML).toEqual('1')
    expect(fixture.nativeElement.querySelector('.email').innerHTML).toEqual('changed@test.com')
  })
})
