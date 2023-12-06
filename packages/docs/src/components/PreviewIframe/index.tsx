import { useComputed } from '@preact/signals-react'
import { useSmallScreen } from '@site/src/hooks/useSmallScreen'

import Styles from './styles.module.css'

type PreviewIframeProps = {
  src: string
}

export default function PreviewIframe({ src }: PreviewIframeProps) {
  const isSmall = useSmallScreen()
  const srcManaged = useComputed(() => {
    return isSmall.value ? src + '&view=preview' : src
  })

  return <iframe src={srcManaged.value} className={Styles.previewIframe} />
}
