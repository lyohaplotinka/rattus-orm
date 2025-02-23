import { merge } from 'lodash-es'
import { describe, expect } from 'vitest'
import { ModuleRegisterEventPayload, RattusEvents } from '../src'
import { ObjectDataProvider } from '../src/data/object-data-provider'
import { EventsDataProviderWrapper } from '../src/events/events-data-provider-wrapper'

class TestEventsDataProviderWrapper extends EventsDataProviderWrapper {
  public getInternalListeners() {
    return this.internalListeners
  }
}

const createProvider = () => {
  const provider = new TestEventsDataProviderWrapper(new ObjectDataProvider())
  provider.registerConnection('entities')
  provider.registerModule(['entities', 'test'])

  return provider
}

describe('events-data-provider-wrapper', () => {
  it('save hooks allow data modification', () => {
    const provider = createProvider()

    provider.listen(RattusEvents.SAVE, (data: any) => {
      data['1'].age = data['1'].age + 1
      return data
    })
    provider.save(['entities', 'test'], { '1': { id: 1, age: 22 } })
    expect(provider.dump()).toStrictEqual({
      entities: { test: { data: { '1': { id: 1, age: 23 } } } },
    })

    provider.listen(RattusEvents.REPLACE, (data: any) => {
      data['1'].age = data['1'].age * 2
      return data
    })
    provider.replace(['entities', 'test'], { '1': { id: 1, age: 10 } })
    expect(provider.dump()).toStrictEqual({
      entities: { test: { data: { '1': { id: 1, age: 20 } } } },
    })

    provider.flush(['entities', 'test'])
    provider.listen(RattusEvents.INSERT, (data: any) => {
      data['1'].age = data['1'].age / 2
      return data
    })
    provider.insert(['entities', 'test'], { '1': { id: 1, age: 50 } })
    expect(provider.dump()).toStrictEqual({
      entities: { test: { data: { '1': { id: 1, age: 25 } } } },
    })

    provider.listen(RattusEvents.UPDATE, (data: any) => {
      data['1'].age = Math.sqrt(data['1'].age)
      return data
    })
    provider.update(['entities', 'test'], { '1': { id: 1, age: 1024 } })
    expect(provider.dump()).toStrictEqual({
      entities: { test: { data: { '1': { id: 1, age: 32 } } } },
    })
  })

  it('can change deleting ids in delete hook', () => {
    const provider = createProvider()

    provider.save(['entities', 'test'], { '1': { id: 1, age: 22 }, '2': { id: 2, age: 44 } })
    provider.listen(RattusEvents.DELETE, () => {
      return ['2']
    })
    provider.delete(['entities', 'test'], ['1'])
    expect(provider.dump()).toStrictEqual({
      entities: { test: { data: { '1': { id: 1, age: 22 } } } },
    })
  })

  it('can modify module path and initial data when registering module', () => {
    const provider = createProvider()

    provider.listen(RattusEvents.MODULE_REGISTER, (data: any) => {
      const {
        path: [connection],
        initialState,
      } = data as ModuleRegisterEventPayload
      return {
        path: [connection, 'modified'],
        initialState: merge({}, initialState, { data: { '1': { age: 44 } } }),
      }
    })

    provider.registerModule(['entities', 'test'], { data: { '1': { id: 1, age: 22 } } })
    expect(provider.dump()).toStrictEqual({
      entities: { test: { data: {} }, modified: { data: { '1': { id: 1, age: 44 } } } },
    })
  })

  it('void events are working', async () => {
    const provider = createProvider()
    let outputs = ''

    provider.listen(RattusEvents.CONNECTION_REGISTER, (data: any) => {
      outputs += data
    })
    provider.listen(RattusEvents.FLUSH, (data: any) => {
      outputs += data
    })

    provider.registerConnection('newconn')
    provider.flush(['newconn', ''])

    expect(outputs).toEqual('newconnnull')
  })

  it('data changed event working', () => {
    const provider = createProvider()
    let outputs = ''

    provider.listen(RattusEvents.DATA_CHANGED, (data: any, modulePath) => {
      outputs = JSON.stringify(data) + JSON.stringify(modulePath)
    })

    provider.save(['entities', 'test'], { '1': { id: 1, age: 1024 } })
    expect(outputs).toEqual(
      '{"path":["entities","test"],"state":{"data":{"1":{"id":1,"age":1024}}}}["entities","test"]',
    )
  })

  it('reset listeners works correctly for event', () => {
    const provider = createProvider()

    provider.listen(RattusEvents.CONNECTION_REGISTER, () => true)
    provider.listen(RattusEvents.REPLACE, (data) => data)

    provider.resetListeners(RattusEvents.REPLACE)

    const listeners = provider.getInternalListeners()
    expect(listeners[RattusEvents.CONNECTION_REGISTER]).toBeInstanceOf(Set)
    expect(listeners[RattusEvents.CONNECTION_REGISTER]!.size).toEqual(1)

    expect(listeners[RattusEvents.REPLACE]).toBeInstanceOf(Set)
    expect(listeners[RattusEvents.REPLACE]!.size).toEqual(0)
  })

  it('reset listeners works correctly if no event passed', () => {
    const provider = createProvider()

    provider.listen(RattusEvents.CONNECTION_REGISTER, () => true)
    provider.listen(RattusEvents.REPLACE, (data) => data)

    provider.resetListeners()

    const listeners = provider.getInternalListeners()
    expect(listeners).toStrictEqual({})
  })
})
