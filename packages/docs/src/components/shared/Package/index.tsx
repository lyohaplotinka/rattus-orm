import Link from '@docusaurus/Link'
import Translate from '@docusaurus/Translate'
import Heading from '@theme/Heading'
import clsx from 'clsx'
import React from 'react'

import styles from './styles.module.scss'

export type PackageItem = {
  title: string
  packageName: string
  picture: string | React.ComponentType<React.ComponentProps<'svg'>>
  link: string
  description: string
}

export function Package({ title, picture: PackagePicture, description, packageName, link }: PackageItem) {
  const picComp =
    typeof PackagePicture === 'string' ? (
      <img src={PackagePicture} className={styles.packageLogo} alt={`${title} image`} />
    ) : (
      <PackagePicture className={styles.packageLogo} role={'img'} />
    )

  return (
    <div className={clsx('card', styles.packageCard)}>
      <div className="card__image padding-horiz--sm">{picComp}</div>
      <div className="card__body">
        <Heading as="h2">{title}</Heading>
        <div className={'margin-bottom--sm mw-full'}>
          <code title={packageName} className={styles.packageName}>
            {packageName}
          </code>
        </div>
        <p className={styles.packageDesc}>{description}</p>
      </div>
      <div className="card__footer">
        <Link to={link} className="button button--outline button--secondary button--block">
          <Translate>See docs</Translate>
        </Link>
      </div>
    </div>
  )
}
