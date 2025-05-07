import { defineConfig } from 'vitepress'
import { getCorePackageSidebar } from './sidebars'
import { getSidebars } from './sidebar/getSidebars'
import { resolve } from 'node:path'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Rattus ORM',
  description: 'ORM for your JS/TS apps',
  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    ru: {
      label: 'Russian',
      lang: 'ru',
      themeConfig: {
        nav: [
          { text: 'Главная', link: '/' },
          { text: 'Документация', link: '/intro' },
        ],
        sidebar: [
          {
            text: 'Интро',
            link: '/ru/intro',
          },
          getCorePackageSidebar('ru'),
        ],
      },
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/intro' },
    ],

    sidebar: [
      {
        text: 'Intro',
        link: '/intro',
      },
      ...(await getSidebars({
        rootDir: resolve(__dirname, '../'),
        docDirs: ['core'],
      })),
      {
        text: 'Integrations',
        collapsed: true,
        items: await getSidebars({
          rootDir: resolve(__dirname, '../'),
          docDirs: ['integrations/docs-vuex'],
        }),
      },
      // getCorePackageSidebar('en'),
      // {
      //   text: I18n.en.integrations.title,
      //   collapsed: true,
      //   items: [
      //     {
      //       text: I18n.en.integrations.vuex.title,
      //       collapsed: true,
      //       items: [
      //         { text: I18n.en.integrations.vuex.gettingStarted, link: '/vuex/getting-started' },
      //       ],
      //     },
      //   ],
      // },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
})
