import { useSignal } from '@preact/signals-react'
import { debounce } from 'lodash-es'
import { useEffect } from 'react'

const match = () => window.matchMedia('(max-width: 996px)').matches

export function useSmallScreen() {
  const isSmall = useSignal(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: does not required here
  useEffect(() => {
    const onResize = debounce(() => {
      isSmall.value = match()
    }, 300)
    onResize()

    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  }, [])

  return isSmall
}
