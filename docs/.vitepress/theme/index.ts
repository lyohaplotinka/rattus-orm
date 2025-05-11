// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
// @ts-ignore
import Home from './layouts/Home.vue'
// @ts-ignore
import RtLiveDemo from '../../components/RtLiveDemo.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp: ({ app }) => {
    app.component('custom-home', Home)
    app.component('RtLiveDemo', RtLiveDemo)
  },
} satisfies Theme
