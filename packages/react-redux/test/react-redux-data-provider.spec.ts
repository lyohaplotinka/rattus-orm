import { describe } from 'vitest'
import { createBasicProviderTest } from '@rattus-orm/core/utils/createBasicProviderTest'
import { ReactReduxDataProvider } from '../src/data-provider/react-redux-data-provider'
import { createStore } from 'redux'

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
