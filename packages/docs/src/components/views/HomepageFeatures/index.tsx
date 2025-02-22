import Link from '@docusaurus/Link'
import Translate, { translate } from '@docusaurus/Translate'
import FrameworkAgnostic from '@site/static/img/framework-agnostic.svg'
import OrganizedStorage from '@site/static/img/organized-storage.svg'
import VuexOrmBased from '@site/static/img/vuex-orm-based.svg'
import Heading from '@theme/Heading'
import clsx from 'clsx'

import styles from './styles.module.css'

type FeatureItem = {
  title: string
  Svg: React.ComponentType<React.ComponentProps<'svg'>>
  description: JSX.Element
}

const FeatureList: FeatureItem[] = [
  {
    title: translate({ message: 'Framework-agnostic' }),
    Svg: FrameworkAgnostic,
    description: (
      <Translate>
        Get ORM-like experience with any frontend framework or library: just use correct Data
        provider.
      </Translate>
    ),
  },
  {
    title: translate({ message: 'Community experience' }),
    Svg: VuexOrmBased,
    description: (
      <>
        {translate({ message: 'Based on the ' })}
        <Link to={'https://next.vuex-orm.org/'}>Vuex ORM Next</Link>
        {translate({
          message: ' codebase, taking into account the experience of the entire community.',
        })}
      </>
    ),
  },
  {
    title: translate({ message: 'Organized storage' }),
    Svg: OrganizedStorage,
    description: (
      <Translate>Your data is organized, you have convenient access to it at any time</Translate>
    ),
  },
]

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg
          className={styles.featureSvg}
          role="img"
        />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={'section-block'}>
      <Heading as={'h1'}>
        <Translate>Main points</Translate>
      </Heading>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature
              key={idx}
              {...props}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
