import { createReactIntegrationTest } from '@rattus-orm/core/utils/reactTestUtils'
import { RattusProvider, ReactSignalsDataProvider, useRepository } from '../src'

createReactIntegrationTest({
  name: 'Signals',
  Provider: RattusProvider,
  useRepositoryHook: useRepository,
  useRattusContextHook: () => ({}),
  ProviderConstructor: ReactSignalsDataProvider,
})
