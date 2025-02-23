import { AsyncPipe, NgIf } from '@angular/common'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Item } from '@rattus-orm/core'
import { TestUser } from '@rattus-orm/core/utils/testUtils'
import { BehaviorSubject } from 'rxjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { RattusContextService, RattusOrmModule } from '../src/public-api'

@Component({
  standalone: true,
  selector: 'test-component',
  template: `<div *ngIf="user | async as user">
    <div class="id">{{ user.id }}</div>
    <div class="age">{{ user.age }}</div>
  </div>`,
  imports: [AsyncPipe, NgIf],
})
export class TestComponent {
  public user: BehaviorSubject<Item<TestUser>>

  constructor(protected readonly contextService: RattusContextService) {
    this.user = this.getUserRepository().observe((repo) => repo.query().where('id', '1').first())
  }

  public getUserRepository() {
    return this.contextService.getRepository(TestUser)
  }
}

describe('angular: reactivity', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(RattusOrmModule.forRoot())
    TestBed.inject(RattusContextService).getRepository(TestUser).save({ id: '1', age: 23 })
  })

  it('renders component with initial data', () => {
    const fixture = TestBed.createComponent(TestComponent)
    fixture.detectChanges()

    expect(fixture.nativeElement.querySelector('.id').innerHTML).toEqual('1')
    expect(fixture.nativeElement.querySelector('.age').innerHTML).toEqual('23')
  })

  it('data reactively changes', () => {
    const fixture = TestBed.createComponent(TestComponent)
    fixture.detectChanges()

    expect(fixture.nativeElement.querySelector('.id').innerHTML).toEqual('1')
    expect(fixture.nativeElement.querySelector('.age').innerHTML).toEqual('23')

    fixture.componentInstance.getUserRepository().save({ id: '1', age: 25 })
    fixture.detectChanges()

    expect(fixture.nativeElement.querySelector('.id').innerHTML).toEqual('1')
    expect(fixture.nativeElement.querySelector('.age').innerHTML).toEqual('25')
  })
})
