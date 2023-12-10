import Link from '@docusaurus/Link'
import Translate from '@docusaurus/Translate'
import { $$t } from '@site/src/utils/utils'
import PiniaLogo from '@site/static/img/integrations/pinia.svg'
import ReactLogo from '@site/static/img/integrations/react.svg'
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
    description: $$t('Vue + Vuex integration'),
  },
  {
    title: 'Pinia',
    packageName: '@rattus-orm/pinia',
    picture: PiniaLogo,
    link: '/docs/category/pinia-integration-vue',
    description: $$t('Vue + Pinia integration'),
  },
  {
    title: 'React Signals',
    packageName: '@rattus-orm/react-signals',
    picture: ReactLogo,
    link: '/docs/category/signals-integration-react',
    description: $$t('React + Preact Signals integration'),
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
    <div className={clsx('col col--4', styles.integrationCol)}>
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
    </div>
  )
}

export default function HomepageIntegrations(): JSX.Element {
  return (
    <section className={'section-block'}>
      <Heading as={'h1'}>
        <Translate>Integrations</Translate>
      </Heading>
      <div className="container padding-vert--lg">
        <div className="row">
          {IntegrationsList.map((props, idx) => (
            <Integration key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
