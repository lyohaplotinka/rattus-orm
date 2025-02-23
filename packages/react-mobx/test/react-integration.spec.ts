import { createReactIntegrationTest } from '@rattus-orm/core/utils/reactTestUtils'
import { observer } from 'mobx-react-lite'
import { RattusProvider, ReactMobxDataProvider, useRepository } from '../src'

createReactIntegrationTest({
  name: 'MobX',
  Provider: RattusProvider,
  useRepositoryHook: useRepository,
  useRattusContextHook: () => ({}),
  ProviderConstructor: ReactMobxDataProvider,
  componentsWrapper: observer,
})
