import Link from '@docusaurus/Link'
import Translate, { translate } from '@docusaurus/Translate'
import LsLogo from '@site/static/img/integrations/local-storage.svg'
import PiniaLogo from '@site/static/img/integrations/pinia.svg'
import ReactLogo from '@site/static/img/integrations/react.svg'
import ReduxLogo from '@site/static/img/integrations/redux.svg'
import VuexLogo from '@site/static/img/integrations/vuex.svg'
import Heading from '@theme/Heading'
import clsx from 'clsx'
import React from 'react'

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
    title: 'React Redux',
    packageName: '@rattus-orm/react-redux',
    picture: ReduxLogo,
    link: '/docs/category/redux-integration-react',
    description: translate({ message: 'React + Redux integration' }),
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

export default function HomepageIntegrations(): JSX.Element {
  return (
    <section className={'section-block'}>
      <Heading as={'h1'}>
        <Translate>Integrations</Translate>
      </Heading>
      <div className={clsx('padding-vert--lg', styles.integrationsWrapper)}>
        {IntegrationsList.map((integration, index) => {
          return <Integration key={`int${index}`} {...integration} />
        })}
      </div>
    </section>
  )
}
