import { createBasicProviderTest } from '@rattus-orm/core/utils/createBasicProviderTest'
import { createStore } from 'redux'
import { describe } from 'vitest'
import { ReactReduxDataProvider } from '../src'

describe('react-redux-data-provider', () => {
  createBasicProviderTest({
    name: 'react-redux',
    connectionRequired: false,
    storeFactory() {
      const store = createStore((state: any = {}, action) => {
        if (action.type === 'test') {
          return {
            ...state,
            test: state.test + 1,
          }
        }
        return state
      })
      const provider = new ReactReduxDataProvider(store)

      return {
        provider,
        store: store,
      }
    },
  })
})
