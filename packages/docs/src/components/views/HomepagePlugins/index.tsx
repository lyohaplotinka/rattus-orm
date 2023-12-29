import { translate } from '@docusaurus/Translate'
import type { PackageItem } from '@site/src/components/shared/Package'
import { PackageList } from '@site/src/components/shared/Package/packageList'
import ZodLogo from '@site/static/img/plugins/zod.svg'
import React from 'react'

const PluginsList: PackageItem[] = [
  {
    title: 'Zod Validate',
    packageName: '@rattus-orm/plugin-zod-validate',
    picture: ZodLogo,
    link: '/docs/category/zod-validate',
    description: translate({ message: 'Data validation with Zod' }),
  },
]

export default function HomepagePlugins(): JSX.Element {
  return <PackageList packages={PluginsList} title={translate({ message: 'Plugins' })} />
}
