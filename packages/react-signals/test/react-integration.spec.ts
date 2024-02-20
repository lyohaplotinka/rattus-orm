import { RattusProvider, ReactSignalsDataProvider, useRattusContext, useRepository } from '../src'
import { createReactIntegrationTest } from '@rattus-orm/core/utils/reactTestUtils'

createReactIntegrationTest({
  name: 'Signals',
  Provider: RattusProvider,
  useRepositoryHook: useRepository,
  useRattusContextHook: useRattusContext,
  ProviderConstructor: ReactSignalsDataProvider,
})
