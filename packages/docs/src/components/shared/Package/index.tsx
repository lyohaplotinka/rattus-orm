import Link from '@docusaurus/Link'
import Translate from '@docusaurus/Translate'
import type { PackageItem } from '@site/src/types'
import Heading from '@theme/Heading'
import clsx from 'clsx'
import type { JSX, PropsWithChildren } from 'react'
import React from 'react'

import styles from './styles.module.scss'

type PackageBaseProps = PropsWithChildren<
  Pick<PackageItem, 'picture' | 'title'> & {
    subtitleSlot: JSX.Element
    descriptionSlot: JSX.Element
    buttonSlot: JSX.Element
    className?: string
  }
>

function PackageBase({
  picture: PackagePicture,
  title,
  subtitleSlot,
  descriptionSlot,
  buttonSlot,
  className = '',
}: PackageBaseProps) {
  const picComp =
    typeof PackagePicture === 'string' ? (
      <img
        src={PackagePicture}
        className={styles.packageLogo}
        alt={`${title} image`}
      />
    ) : (
      <PackagePicture
        className={styles.packageLogo}
        role={'img'}
      />
    )

  return (
    <div className={clsx('card', styles.packageCard, className)}>
      <div className="card__image padding-horiz--sm">{picComp}</div>
      <div className="card__body">
        <Heading as="h2">{title}</Heading>
        <div className={'margin-bottom--sm mw-full'}>{subtitleSlot}</div>
        {descriptionSlot}
      </div>
      <div className="card__footer">{buttonSlot}</div>
    </div>
  )
}

function ComingSoonPackage({ title, picture: PackagePicture, description }) {
  return (
    <PackageBase
      title={title}
      picture={PackagePicture}
      subtitleSlot={
        <code className={styles.packageName}>
          <Translate>coming soon</Translate>
        </code>
      }
      descriptionSlot={<p className={styles.packageDesc}>{description}</p>}
      buttonSlot={
        <div className={'button button--outline button--secondary button--block'}>
          <Translate>Coming soon</Translate>
        </div>
      }
      className={styles.comingSoonPackage}
    />
  )
}

function ReleasedPackage({
  title,
  picture: PackagePicture,
  description,
  packageName,
  link,
  liveDemoUrl,
}: PackageItem) {
  return (
    <PackageBase
      title={title}
      picture={PackagePicture}
      subtitleSlot={
        <code
          title={packageName}
          className={styles.packageName}
        >
          {packageName}
        </code>
      }
      descriptionSlot={<p className={styles.packageDesc}>{description}</p>}
      buttonSlot={
        <>
          {' '}
          <Link
            to={link}
            className={clsx(
              'button button--outline button--secondary',
              liveDemoUrl ? styles.buttonReducedPadding : 'button--block',
            )}
          >
            <Translate>See docs</Translate>
          </Link>
          {liveDemoUrl && (
            <Link
              to={liveDemoUrl}
              className={clsx(
                'button button--outline button--secondary',
                styles.buttonReducedPadding,
              )}
            >
              <Translate>Live demo</Translate>
            </Link>
          )}{' '}
        </>
      }
    />
  )
}

export function Package(props: PackageItem) {
  if (props.comingSoon) {
    return <ComingSoonPackage {...props} />
  }

  return <ReleasedPackage {...props} />
}
