import { describe, expect, it } from 'vitest'
import { renderAndGetContext } from './test-utils'
import { createDatabase } from '@rattus-orm/core'
import { ObjectDataProvider } from '@rattus-orm/core/object-data-provider'
import { render } from '@testing-library/svelte'
import FuncExecutor from './components/FuncExecutor.svelte'
import { useRattusContext } from '../dist/rattus-orm-svelte-provider'
import { testContext } from '@rattus-orm/core/utils/testUtils'

class TestDataProvider extends ObjectDataProvider {}

describe('svelte: context', () => {
  it('Context valid', async () => {
    const res = renderAndGetContext()
    testContext(res, ObjectDataProvider)
  })

  it('Context params respect custom databases', () => {
    const database = createDatabase({ dataProvider: new TestDataProvider(), connection: 'custom' })
    database.start()

    const result = renderAndGetContext({ database })
    testContext(result, ObjectDataProvider, 'custom')
  })

  it('Throws error if not wrapped in provider', () => {
    expect(() => render(FuncExecutor, { props: { callbackFunction: () => useRattusContext() } })).toThrowError()
  })
})
