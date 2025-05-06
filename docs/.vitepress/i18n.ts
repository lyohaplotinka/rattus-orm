export type Locale = 'en' | 'ru'

export const I18n = {
  en: {
    intro: 'Intro',
    core: {
      title: 'Core package',
      gettingStarted: 'Getting started',
      dataProvider: 'Data provider',
      database: 'Database',
      models: 'Models',
      relationships: 'Relationships',
      repository: 'Repository',
      events: 'Events',
      plugins: 'Plugins',
    },
    integrations: {
      title: 'Integrations',
      vuex: {
        title: 'Vuex integration (Vue)',
        gettingStarted: 'Getting started',
      },
    },
  },
  ru: {
    intro: 'Интро',
    core: {
      title: 'Основной пакет',
      gettingStarted: 'Начало работы',
      dataProvider: 'Data provider',
      database: 'База данных',
      models: 'Модель',
      relationships: 'Связи',
      repository: 'Репозиторий',
      events: 'События',
      plugins: 'Плагины',
    },
    integrations: {
      title: 'Интеграции',
      vuex: {
        title: 'Интеграция с Vuex (Vue)',
        gettingStarted: 'Введение',
      },
    },
  },
} as const satisfies Record<Locale, any>
