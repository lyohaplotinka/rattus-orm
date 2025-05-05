import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

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
      {
        text: 'Core package',
        collapsed: true,
        items: [
          { text: 'Getting started', link: '/core/getting-started' },
          { text: 'Data provider', link: '/core/data-provider' },
          { text: 'Database', link: '/core/database' },
          { text: 'Models', link: '/core/models' },
          { text: 'Relationships', link: '/core/relationships' },
          { text: 'Repository', link: '/core/repository' },
          { text: 'Events', link: '/core/events' },
          { text: 'Plugins', link: '/core/plugins' },
          { text: 'API', link: '/api/index.html', target: '_blank' },
        ],
      },
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
    },
  },
})
