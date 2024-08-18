import Link from '@docusaurus/Link'
import Translate, { translate } from '@docusaurus/Translate'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import HomepageFeatures from '@site/src/components/views/HomepageFeatures'
import HomepageIntegrations from '@site/src/components/views/HomepageIntegrations'
import HomepagePlugins from '@site/src/components/views/HomepagePlugins'
import Logo from '@site/static/img/logo.svg'
import threeLibsDemo from '@site/static/img/three-libs-demo.png'
import Heading from '@theme/Heading'
import Layout from '@theme/Layout'
import clsx from 'clsx'

import styles from './index.module.css'

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.titleBlock}>
          <Logo className={styles.logo} />
          <Heading as="h1" className={clsx('hero__title', styles.heroTitle)}>
            {siteConfig.title}
          </Heading>
        </div>
        <p className="hero__subtitle">
          <Translate>ORM for your JS/TS apps</Translate>
        </p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            <Translate>Read documentation</Translate>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={siteConfig.title}
      description={translate({ message: 'Object-Relational Mapping (ORM) like experience for JS/TS applications' })}
    >
      <HomepageHeader />
      <main>
        <div className="flex flex-col items-center mt-10">
          <Heading as={'h1'}>
            <Translate>Framework-agnostic</Translate>
          </Heading>
          <p className={'hero__subtitle text-center'}>
            <Translate>ORM-like experience for any state management library</Translate>
          </p>
          <img src={threeLibsDemo} alt={'React, Vue and Angular demo'} className={'w-220'} />
        </div>
        <HomepageIntegrations />
        <HomepagePlugins />
        <HomepageFeatures />
      </main>
    </Layout>
  )
}
