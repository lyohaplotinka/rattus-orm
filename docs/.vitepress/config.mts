import { defineConfig } from 'vitepress'
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
          ...getSidebars({
            rootDir: resolve(__dirname, '../'),
            docDirs: ['ru/core', 'ru/integrations'],
          }),
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
      ...getSidebars({
        rootDir: resolve(__dirname, '../'),
        docDirs: ['core', 'integrations'],
      }),
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
})
