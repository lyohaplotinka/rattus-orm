---
# https://vitepress.dev/reference/default-theme-home-page
layout: custom-home
sidebar: false

hero:
  name: "Rattus ORM"
  text: "ORM for your JS/TS apps"
  image: 
    src: ./logo.svg
    alt: Rattus ORM
  actions:
    - theme: brand
      text: Documentation
      link: /intro
    - theme: alt
      text: Demo
      link: https://stackblitz.com/edit/vitejs-vite-uvhvpx?embed=1&file=src%2Fmodels%2FUser.ts

threeLibsTitle: ORM experience for any state management
seeDocs: See docs
liveDemo: Live demo

integrationsTitle: Integrations
integrations:
  - title: Vuex
    package: "@rattus-orm/vuex"
    icon: /images/integrations/vuex.svg
    text: Vue + Vuex integration
    docs: /integrations/docs-vuex/getting-started
    demo: "https://stackblitz.com/edit/vitejs-vite-uvhvpx?embed=1&file=src%2Fmodels%2FUser.ts"
  - title: Pinia
    package: "@rattus-orm/pinia"
    icon: /images/integrations/pinia.svg
    text: Vue + Pinia integration
    docs: /integrations/docs-pinia/getting-started
    demo: "https://stackblitz.com/edit/vitejs-vite-gheh5j?embed=1&file=src%2Fmodels%2FUser.ts"
  - title: React MobX
    package: "@rattus-orm/react-mobx"
    icon: /images/integrations/mobx.svg
    text: React + MobX integration
    docs: /integrations/docs-react-mobx/getting-started
    demo: "https://stackblitz.com/edit/vitejs-vite-y4vza6?embed=1&file=src%2Fmodels%2FUser.ts"
  - title: React Redux
    package: "@rattus-orm/react-redux"
    icon: /images/integrations/redux.svg
    text: React + Redux integration
    docs: /
    demo: /
  - title: React Signals
    package: "@rattus-orm/react-signals"
    icon: /images/integrations/react.svg
    text: React + Signals integration
    docs: /
    demo: /
  - title: Angular RxJS
    package: "@rattus-orm/angular-rxjs"
    icon: /images/integrations/angular.svg
    text: Angular RxJS integration
    docs: /
    demo: /
  - title: Svelte
    package: "@rattus-orm/svelte"
    icon: /images/integrations/svelte.svg
    text: Svelte integration
    docs: /
    demo: /
  - title: Solid.js
    package: "@rattus-orm/solidjs"
    icon: /images/integrations/solidjs.svg
    text: Solid integration
    docs: /
    demo: /
  - title: LocalStorage
    package: "@rattus-orm/local-storage"
    icon: /images/integrations/local-storage.svg
    text: localStorage integration
    docs: /
    demo: /

pluginsTitle: Plugins
plugins:
  - title: Zod Validate
    package: "@rattus-orm/plugin-zod-validate"
    icon: /images/plugins/zod.svg
    text: Data validation with Zod
    docs: /
    demo: /

features:
  - title: Framework-agnostic
    icon: 
      src: /images/features/framework-agnostic.svg
      alt: Framework-agnostic
    details: "Get ORM-like experience with any frontend framework or library: just use correct Data provider."
  - title: Community experience
    icon:
      src: /images/features/vuex-orm-based.svg
      alt: Community experience
    details: "Based on the <a target='_blank' href='https://next.vuex-orm.org/' style='text-decoration: underline dashed'>Vuex ORM Next</a> codebase, taking into account the experience of the entire community."
  - title: Organized storage
    icon:
      src: /images/features/organized-storage.svg
      alt: Organized storage
    details: "Your data is organized, you have convenient access to it at any time"
---

