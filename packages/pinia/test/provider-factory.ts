import { TestingStoreFactory } from '../../../test/utils/types'
import { createPinia } from 'pinia'
import { TestStore } from '../../../test/utils/test-store'
import { PiniaDataProvider } from '../src/data-provider/pinia-data-provider'

export const dataProviderFactory: TestingStoreFactory = () => {
  const piniaInstance = createPinia()
  const piniaStore = new TestStore(new PiniaDataProvider(piniaInstance))

  return new Proxy(piniaStore, {
    get(target: TestStore, p: string | symbol): any {
      if (p === 'state') {
        return {
          entities: new Proxy(piniaInstance.state.value, {
            get(target: any, p: string | symbol): any {
              console.log(p)
              if (typeof p === 'string' && !p.startsWith('_')) {
                return target[`entities/${p}`]
              }
              return target[p]
            },
            set(target: any, p: string | symbol, newValue: any): boolean {
              if (typeof p === 'string' && !p.startsWith('_')) {
                target[`entities/${p}`] = newValue
                return true
              }
              target[p] = newValue
              return true
            },
          }),
        }
      }
      return target[p]
    },
  })
}
