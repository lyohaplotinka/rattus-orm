import { RattusProvider, ReactReduxDataProvider, useRepository } from '../src'
import { createStore } from 'redux'
import { createReactIntegrationTest } from '@rattus-orm/core/utils/reactTestUtils'

createReactIntegrationTest({
  name: 'Redux',
  Provider: RattusProvider,
  bootstrap: () => ({ store: createStore((state) => state) }),
  useRepositoryHook: useRepository,
  useRattusContextHook: () => ({}),
  ProviderConstructor: ReactReduxDataProvider,
  providerArgsGetter: () => [createStore((state) => state)],
})
