import { createReactIntegrationTest } from '@rattus-orm/core/utils/reactTestUtils'
import { createStore } from 'redux'
import { RattusProvider, ReactReduxDataProvider, useRepository } from '../src'

createReactIntegrationTest({
  name: 'Redux',
  Provider: RattusProvider,
  bootstrap: () => ({ store: createStore((state) => state) }),
  useRepositoryHook: useRepository,
  useRattusContextHook: () => ({}),
  ProviderConstructor: ReactReduxDataProvider,
  providerArgsGetter: () => [createStore((state) => state)],
})
