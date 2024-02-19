import { describe, expect, it } from 'vitest'
import { renderAndGetContext } from './test-utils'
import { Database } from '@rattus-orm/core'
import { isUnknownRecord } from '@rattus-orm/core/utils/isUnknownRecord'
import { RattusContext } from '@rattus-orm/core/utils/rattus-context'
import { ObjectDataProvider } from '@rattus-orm/core/object-data-provider'
import { render } from '@testing-library/svelte'
import FuncExecutor from './components/FuncExecutor.svelte'
import { useRattusContext } from '../dist/rattus-orm-svelte-provider'
import { isInitializedContext } from '@rattus-orm/core/utils/integrationsHelpers'

class TestDataProvider extends ObjectDataProvider {}

describe('svelte: context', () => {
  it('Context valid', async () => {
    const res = renderAndGetContext()
    expect(isInitializedContext(res)).toEqual(true)
    expect(res.$database).toBeInstanceOf(Database)
    expect(isUnknownRecord(res.$databases)).toEqual(true)
    expect(res.$databases.entities).toBeInstanceOf(Database)
  })

  it('Context params respect custom databases', () => {
    const database = new Database().setDataProvider(new TestDataProvider()).setConnection('custom')
    database.start()

    const result = renderAndGetContext({ database })
    expect(result).toBeInstanceOf(RattusContext)
    expect(result.$database.isStarted()).toEqual(true)
    expect((result.$database.getDataProvider() as any).provider).toBeInstanceOf(TestDataProvider)
    expect(result.$database.getConnection()).toEqual('custom')
  })

  it('Throws error if not wrapped in provider', () => {
    expect(() => render(FuncExecutor, { props: { callbackFunction: () => useRattusContext() } })).toThrowError()
  })
})
