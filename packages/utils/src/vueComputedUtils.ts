import type { ComputedGetter, ComputedRef, DebuggerOptions } from 'vue'
import { computed } from 'vue'

export interface ComputedRefExtended<T = any> extends ComputedRef<T> {
  filter(...args: Parameters<typeof Array.prototype.filter>): ReturnType<typeof Array.prototype.filter>
}

export function extendedComputed<T = any>(
  getter: ComputedGetter<T>,
  debugOptions?: DebuggerOptions,
): ComputedRefExtended<T> {
  const ref = computed<T>(getter, debugOptions)

  Object.defineProperties(ref, {
    filter: {
      value: (...args: Parameters<typeof Array.prototype.filter>) => {
        if (!Array.isArray(ref.value)) {
          throw new TypeError('[extendedComputed] Unable to filter by computed value: it is not an array')
        }
        return ref.value.filter(...args)
      },
    },
  })

  return ref as ComputedRefExtended<T>
}

export function computedProxify<T extends Record<any, any>>(object: T, keysToProxify: string[]): T {
  return new Proxy(object, {
    get: (target: any, p: string): any => {
      if (keysToProxify.includes(p)) {
        return (...args: any[]) => {
          return extendedComputed(() => object[p](...args))
        }
      }

      return target[p]
    },
  })
}
