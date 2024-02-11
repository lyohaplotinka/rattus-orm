import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class RattusOrmAngularRxjsService {
  protected readonly state = new BehaviorSubject<string>('wow')

  constructor() {}

  public sayHello() {
    console.log('Hello!')
  }

  public stateObservable() {
    return this.state.asObservable()
  }

  public updateState(newState: string) {
    this.state.next(newState)
  }
}
