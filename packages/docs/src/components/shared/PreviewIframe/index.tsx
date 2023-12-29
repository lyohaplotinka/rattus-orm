import { Loader } from '@site/src/components/shared/Loader'
import clsx from 'clsx'
import { useRef, useState } from 'react'

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
  const [iframeHeight, setIframeHeight] = useState<number | undefined>(0)
  const [showLoader, setShowLoader] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>()

  const onIframeLoad = () => {
    setIframeHeight(undefined)
    setShowLoader(false)
  }

  return (
    <>
      {showLoader && <PreviewIframePlaceholder />}
      <iframe
        onLoad={onIframeLoad}
        ref={iframeRef}
        src={src}
        style={{ height: iframeHeight }}
        className={Styles.previewIframe}
      />
    </>
  )
}
