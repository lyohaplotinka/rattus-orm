import { beforeEach, describe, it } from 'vitest'
import { renderWithContext } from './test-utils'
import { createDatabase, getDatabaseManager } from '@rattus-orm/core'
import { ObjectDataProvider } from '@rattus-orm/core/object-data-provider'
import { testBootstrap } from '@rattus-orm/core/utils/testUtils'
import FuncExecutor from './components/FuncExecutor.svelte'
import { noop } from 'lodash-es'

class TestDataProvider extends ObjectDataProvider {}

describe('svelte: context', () => {
  beforeEach(() => {
    getDatabaseManager().clear()
  })

  it('Context valid', async () => {
    renderWithContext(FuncExecutor, undefined, { callbackFunction: noop })
    testBootstrap(ObjectDataProvider)
  })

  it('Context params respect custom databases', () => {
    const database = createDatabase({ dataProvider: new TestDataProvider(), connection: 'custom' })
    database.start()

    renderWithContext(FuncExecutor, { database }, { callbackFunction: noop })
    testBootstrap(ObjectDataProvider, 'custom')
  })
})
