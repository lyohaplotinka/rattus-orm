---
# https://vitepress.dev/reference/default-theme-home-page
layout: custom-home
sidebar: false

hero:
  name: "Rattus ORM"
  text: "ORM для ваших JS/TS приложений"
  image: 
    src: /logo.svg
    alt: Rattus ORM
  actions:
    - theme: brand
      text: Документация
      link: /markdown-examples
    - theme: alt
      text: Демо
      link: /api-examples

threeLibsTitle: Опыт использования ORM для любой библиотеки управления состоянием
seeDocs: Подробнее
liveDemo: Демо

integrationsTitle: Интеграции
integrations:
  - title: Vuex
    package: "@rattus-orm/vuex"
    icon: /images/integrations/vuex.svg
    text: Rattus для Vue + Vuex
    docs: /
    demo: /
  - title: Pinia
    package: "@rattus-orm/pinia"
    icon: /images/integrations/pinia.svg
    text: Rattus для Vue + Pinia
    docs: /
    demo: /
  - title: React MobX
    package: "@rattus-orm/react-mobx"
    icon: /images/integrations/mobx.svg
    text: Rattus для React + MobX
    docs: /
    demo: /
  - title: React Redux
    package: "@rattus-orm/react-redux"
    icon: /images/integrations/redux.svg
    text: Rattus для React + Redux
    docs: /
    demo: /
  - title: React Signals
    package: "@rattus-orm/react-signals"
    icon: /images/integrations/react.svg
    text: Rattus для React + Signals
    docs: /
    demo: /
  - title: Angular RxJS
    package: "@rattus-orm/angular-rxjs"
    icon: /images/integrations/angular.svg
    text: Rattus для Angular RxJS
    docs: /
    demo: /
  - title: Svelte
    package: "@rattus-orm/svelte"
    icon: /images/integrations/svelte.svg
    text: Rattus для Svelte
    docs: /
    demo: /
  - title: Solid.js
    package: "@rattus-orm/solidjs"
    icon: /images/integrations/solidjs.svg
    text: Rattus для Solid
    docs: /
    demo: /
  - title: LocalStorage
    package: "@rattus-orm/local-storage"
    icon: /images/integrations/local-storage.svg
    text: Rattus для localStorage
    docs: /
    demo: /

pluginsTitle: Плагины
plugins:
  - title: Zod Validate
    package: "@rattus-orm/plugin-zod-validate"
    icon: /images/plugins/zod.svg
    text: Валидация данных с помощью Zod
    docs: /
    demo: /

features:
  - title: Не зависит от фреймворка
    icon: 
      src: /images/features/framework-agnostic.svg
      alt: Framework-agnostic
    details: "Работайте с ORM с любым фронтенд-фреймворком или библиотекой: нужен лишь правильный Data provider"
  - title: Опыт сообщества
    icon:
      src: /images/features/vuex-orm-based.svg
      alt: Community experience
    details: "Основано на кодовой базе Vuex ORM Next учитывая опыт разработки целым сообществом."
  - title: Порядок в хранилище
    icon:
      src: /images/features/organized-storage.svg
      alt: Organized storage
    details: "Ваши данные упорядочены, вы имеете к ним удобный доступ в любой момент."
---

