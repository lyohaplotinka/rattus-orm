import type { PackageItem } from '@site/src/components/shared/Package/index'
import { Package } from '@site/src/components/shared/Package/index'
import Heading from '@theme/Heading'
import clsx from 'clsx'
import React from 'react'

import styles from './styles.module.scss'

type PackageListProps = {
  packages: PackageItem[]
  title: string
}

export function PackageList({ packages, title }: PackageListProps) {
  return (
    <section className={'section-block'}>
      <Heading as={'h1'}>{title}</Heading>
      <div className={clsx('padding-vert--lg', styles.packagesWrapper)}>
        {packages.map((integration, index) => {
          return <Package key={`int${index}`} {...integration} />
        })}
      </div>
    </section>
  )
}
