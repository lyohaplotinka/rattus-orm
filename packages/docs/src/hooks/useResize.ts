import { effect, useSignal } from '@preact/signals-react'
import { useEffect } from 'react'

export const useResize = (callback: (size: number) => void) => {
  const windowSize = useSignal(0)

  effect(() => {
    callback(windowSize.value)
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: does not required here
  useEffect(() => {
    const onResize = () => {
      windowSize.value = window.innerWidth
    }
    onResize()

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return windowSize
}
