import { I18n, Locale } from './i18n'
import { DefaultTheme } from 'vitepress'

export const getCorePackageSidebar = (locale: Locale = 'en'): DefaultTheme.SidebarItem => ({
  text: I18n[locale].core.title,
  collapsed: true,
  items: [
    {
      text: I18n[locale].core.gettingStarted,
      link: '/core/getting-started',
      base: locale === 'en' ? undefined : locale,
    },
    {
      text: I18n[locale].core.dataProvider,
      link: '/core/data-provider',
      base: locale === 'en' ? undefined : locale,
    },
    {
      text: I18n[locale].core.database,
      link: '/core/database',
      base: locale === 'en' ? undefined : locale,
    },
    {
      text: I18n[locale].core.models,
      link: '/core/models',
      base: locale === 'en' ? undefined : locale,
    },
    {
      text: I18n[locale].core.relationships,
      link: '/core/relationships',
      base: locale === 'en' ? undefined : locale,
    },
    {
      text: I18n[locale].core.repository,
      link: '/core/repository',
      base: locale === 'en' ? undefined : locale,
    },
    {
      text: I18n[locale].core.events,
      link: '/core/events',
      base: locale === 'en' ? undefined : locale,
    },
    {
      text: I18n[locale].core.plugins,
      link: '/core/plugins',
      base: locale === 'en' ? undefined : locale,
    },
    {
      text: 'API',
      link: '/api/index.html',
      target: '_blank',
    },
  ],
})
