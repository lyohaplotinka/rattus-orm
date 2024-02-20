import { RattusProvider, ReactMobxDataProvider, useRattusContext, useRepository } from '../src'
import { createReactIntegrationTest } from '@rattus-orm/core/utils/reactTestUtils'
import { observer } from 'mobx-react-lite'

createReactIntegrationTest({
  name: 'MobX',
  Provider: RattusProvider,
  useRepositoryHook: useRepository,
  useRattusContextHook: useRattusContext,
  ProviderConstructor: ReactMobxDataProvider,
  componentsWrapper: observer,
})
