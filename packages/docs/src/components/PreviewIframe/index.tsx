import { useComputed, useSignal } from '@preact/signals-react'
import { Loader } from '@site/src/components/Loader'
import { useSmallScreen } from '@site/src/hooks/useSmallScreen'
import clsx from 'clsx'
import { useCallback, useRef } from 'react'

import Styles from './styles.module.scss'

type PreviewIframeProps = {
  src: string
}

function PreviewIframePlaceholder() {
  return (
    <div className={clsx(Styles.previewIframe, Styles.placeholder)}>
      <Loader />
    </div>
  )
}

export default function PreviewIframe({ src }: PreviewIframeProps) {
  const iframeHeight = useSignal<number | undefined>(0)
  const showLoader = useSignal(true)
  const iframeRef = useRef<HTMLIFrameElement>()
  const isSmall = useSmallScreen()
  const srcManaged = useComputed(() => {
    return isSmall.value ? src + '&view=preview' : src
  })

  const onIframeLoad = useCallback(() => {
    iframeHeight.value = undefined
    showLoader.value = false
  }, [])

  return (
    <>
      {showLoader.value && <PreviewIframePlaceholder />}
      <iframe
        onLoad={onIframeLoad}
        ref={iframeRef}
        src={srcManaged.value}
        style={{ height: iframeHeight.value }}
        className={Styles.previewIframe}
      />
    </>
  )
}
