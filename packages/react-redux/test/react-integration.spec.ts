import { RattusProvider, ReactReduxDataProvider, useRattusContext, useRepository } from '../src'
import { createStore } from 'redux'
import '@testing-library/jest-dom/vitest'
import { createReactIntegrationTest } from '@rattus-orm/core/utils/reactTestUtils'

createReactIntegrationTest({
  name: 'Redux',
  Provider: RattusProvider,
  bootstrap: () => ({ store: createStore((state) => state) }),
  useRepositoryHook: useRepository,
  useRattusContextHook: useRattusContext,
  ProviderConstructor: ReactReduxDataProvider,
  providerArgsGetter: () => [createStore((state) => state)],
})
