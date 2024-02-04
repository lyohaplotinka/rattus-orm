import { translate } from '@docusaurus/Translate'
import type { PackageItem } from '@site/src/components/shared/Package'
import LsLogo from '@site/static/img/integrations/local-storage.svg'
import MobxLogo from '@site/static/img/integrations/mobx.svg'
import PiniaLogo from '@site/static/img/integrations/pinia.svg'
import ReactLogo from '@site/static/img/integrations/react.svg'
import ReduxLogo from '@site/static/img/integrations/redux.svg'
import VuexLogo from '@site/static/img/integrations/vuex.svg'

export const IntegrationsList: PackageItem[] = [
  {
    title: 'Vuex',
    packageName: '@rattus-orm/vuex',
    picture: VuexLogo,
    link: '/docs/category/vuex-integration-vue',
    description: translate({ message: 'Vue + Vuex integration' }),
    liveDemoUrl: 'https://stackblitz.com/edit/vitejs-vite-uvhvpx?embed=1&file=src%2Fmodels%2FUser.ts',
  },
  {
    title: 'Pinia',
    packageName: '@rattus-orm/pinia',
    picture: PiniaLogo,
    link: '/docs/category/pinia-integration-vue',
    description: translate({ message: 'Vue + Pinia integration' }),
    liveDemoUrl: 'https://stackblitz.com/edit/vitejs-vite-gheh5j?embed=1&file=src%2Fmodels%2FUser.ts',
  },
  {
    title: 'React MobX',
    packageName: '@rattus-orm/react-mobx',
    picture: MobxLogo,
    link: '/docs/category/mobx-integration-react',
    description: translate({ message: 'React + MobX integration' }),
    liveDemoUrl: 'https://stackblitz.com/edit/vitejs-vite-y4vza6?embed=1&file=src%2Fmodels%2FUser.ts',
  },
  {
    title: 'React Redux',
    packageName: '@rattus-orm/react-redux',
    picture: ReduxLogo,
    link: '/docs/category/redux-integration-react',
    description: translate({ message: 'React + Redux integration' }),
    liveDemoUrl: 'https://stackblitz.com/edit/vitejs-vite-ug5prg?embed=1&file=src%2Fmodels%2FUser.ts',
  },
  {
    title: 'React Signals',
    packageName: '@rattus-orm/react-signals',
    picture: ReactLogo,
    link: '/docs/category/signals-integration-react',
    description: translate({ message: 'React + Signals integration' }),
    liveDemoUrl: 'https://stackblitz.com/edit/vitejs-vite-ra2xlc?embed=1&file=src%2Fmodels%2FUser.ts',
  },
  {
    title: 'LocalStorage',
    packageName: '@rattus-orm/local-storage',
    picture: LsLogo,
    link: '/docs/category/localstorage-integration',
    description: translate({ message: 'localStorage integration' }),
    liveDemoUrl: 'https://stackblitz.com/edit/typescript-bjcfue?embed=1&file=models%2FUser.ts',
  },
]

export const getIntegrationByTitle = (title: string): PackageItem => {
  const integration = IntegrationsList.find((item) => item.title === title)
  if (!integration) {
    throw new Error(`Integration "${title}" not found`)
  }
  return integration
}
