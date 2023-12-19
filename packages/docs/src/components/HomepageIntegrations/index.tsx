import Link from '@docusaurus/Link'
import Translate, { translate } from '@docusaurus/Translate'
import { useSignal } from '@preact/signals-react'
import { useResize } from '@site/src/hooks/useResize'
import LsLogo from '@site/static/img/integrations/local-storage.svg'
import PiniaLogo from '@site/static/img/integrations/pinia.svg'
import ReactLogo from '@site/static/img/integrations/react.svg'
import VuexLogo from '@site/static/img/integrations/vuex.svg'
import Heading from '@theme/Heading'
import clsx from 'clsx'
import { chunk, isEqual } from 'lodash-es'
import React, { useRef } from 'react'

import styles from './styles.module.scss'

type IntegrationItem = {
  title: string
  packageName: string
  picture: string | React.ComponentType<React.ComponentProps<'svg'>>
  link: string
  description: string
}

const IntegrationsList: IntegrationItem[] = [
  {
    title: 'Vuex',
    packageName: '@rattus-orm/vuex',
    picture: VuexLogo,
    link: '/docs/category/vuex-integration-vue',
    description: translate({ message: 'Vue + Vuex integration' }),
  },
  {
    title: 'Pinia',
    packageName: '@rattus-orm/pinia',
    picture: PiniaLogo,
    link: '/docs/category/pinia-integration-vue',
    description: translate({ message: 'Vue + Pinia integration' }),
  },
  {
    title: 'React Signals',
    packageName: '@rattus-orm/react-signals',
    picture: ReactLogo,
    link: '/docs/category/signals-integration-react',
    description: translate({ message: 'React + Signals integration' }),
  },
  {
    title: 'LocalStorage',
    packageName: '@rattus-orm/local-storage',
    picture: LsLogo,
    link: '/docs/category/localstorage-integration',
    description: translate({ message: 'localStorage integration' }),
  },
]

function Integration({ title, picture: IntegrationPicture, description, packageName, link }: IntegrationItem) {
  const picComp =
    typeof IntegrationPicture === 'string' ? (
      <img src={IntegrationPicture} className={styles.integrationLogo} alt={`${title} image`} />
    ) : (
      <IntegrationPicture className={styles.integrationLogo} role={'img'} />
    )

  return (
    <div className={clsx('card', styles.integrationCard)}>
      <div className="card__image padding-horiz--sm">{picComp}</div>
      <div className="card__body">
        <Heading as="h2">{title}</Heading>
        <div className={'margin-bottom--sm'}>
          <code>{packageName}</code>
        </div>
        <p>{description}</p>
      </div>
      <div className="card__footer">
        <Link to={link} className="button button--outline button--secondary button--block">
          <Translate>See docs</Translate>
        </Link>
      </div>
    </div>
  )
}

const cardWidth = parseInt(styles.cardWidth)

export default function HomepageIntegrations(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>()
  const chunked = useSignal<IntegrationItem[][]>([])

  useResize(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const width = container.offsetWidth
    const itemsPerRow = Math.floor(width / (cardWidth + 7))
    const newChunked = chunk(IntegrationsList, itemsPerRow)
    if (isEqual(chunked.value, newChunked)) {
      return
    }
    chunked.value = newChunked
  })

  return (
    <section className={'section-block'}>
      <Heading as={'h1'}>
        <Translate>Integrations</Translate>
      </Heading>
      <div ref={containerRef} className={clsx('padding-vert--lg', styles.integrationsWrapper)}>
        {chunked.value.map((intArray, rowIdx) => {
          return (
            <div className={clsx(styles.integrationRow)} key={`row${rowIdx}`}>
              {intArray.map((integration, index) => {
                return <Integration key={`int${index}`} {...integration} />
              })}
            </div>
          )
        })}
      </div>
    </section>
  )
}
