import type { ModulePath, State } from '@rattus-orm/core'
import { type Reducer, type Store } from 'redux'

import type { RattusReducerAction, RattusReducerActionName, RattusReducerPrefix, RattusReduxActionName } from './types'
import { rattusReduxActions } from './types'

export class ReducerStore<MP extends ModulePath> {
  constructor(
    protected readonly strore: Store,
    protected readonly modulePath: MP,
    protected readonly initialState?: State,
  ) {}

  public dispatch(action: RattusReduxActionName, payload: any) {
    this.strore.dispatch({
      type: this.getModuleAction(action),
      payload,
    })
  }

  public getReducer(): Reducer<State, RattusReducerAction<MP>> {
    return (state = this.initialState ?? { data: {} }, action) => {
      switch (action.type) {
        case this.getModuleAction(rattusReduxActions.FRESH): {
          return {
            ...state,
            data: action.payload,
          }
        }

        case this.getModuleAction(rattusReduxActions.FLUSH): {
          return {
            data: {},
          }
        }

        case this.getModuleAction(rattusReduxActions.SAVE): {
          return {
            data: {
              ...(state?.data ?? {}),
              ...action.payload,
            },
          }
        }

        case this.getModuleAction(rattusReduxActions.DESTROY): {
          const currentElements = state?.data ?? {}
          const updated = {}
          for (const key in currentElements) {
            if (action.payload.includes(key)) {
              continue
            }
            updated[key] = currentElements[key]
          }
          return {
            data: updated,
          }
        }

        default:
          return state
      }
    }
  }

  public getReducerPrefix(): RattusReducerPrefix<MP> {
    return `$$rattus/${this.modulePath.join('/')}` as RattusReducerPrefix<MP>
  }

  public getModuleAction<A extends RattusReduxActionName>(action: A): RattusReducerActionName<MP> {
    return `${this.getReducerPrefix()}/${action}` as RattusReducerActionName<MP>
  }
}
