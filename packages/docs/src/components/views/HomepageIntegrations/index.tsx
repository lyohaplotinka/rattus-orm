import { translate } from '@docusaurus/Translate'
import type { PackageItem } from '@site/src/components/shared/Package'
import { PackageList } from '@site/src/components/shared/Package/packageList'
import LsLogo from '@site/static/img/integrations/local-storage.svg'
import PiniaLogo from '@site/static/img/integrations/pinia.svg'
import ReactLogo from '@site/static/img/integrations/react.svg'
import ReduxLogo from '@site/static/img/integrations/redux.svg'
import VuexLogo from '@site/static/img/integrations/vuex.svg'
import React from 'react'

const IntegrationsList: PackageItem[] = [
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

export default function HomepageIntegrations(): JSX.Element {
  return <PackageList packages={IntegrationsList} title={translate({ message: 'Integrations' })} />
}
