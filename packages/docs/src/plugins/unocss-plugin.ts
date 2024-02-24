import type { Plugin } from '@docusaurus/types'
import UnoCSS from '@unocss/webpack'

export default function (): Plugin<any> {
  return {
    name: 'docusaurus-plugin-unocss',
    configureWebpack() {
      return {
        mergeStrategy: {
          plugins: 'prepend',
        },
        plugins: [
          UnoCSS({
            configFile: '../../uno.config.ts',
          }),
        ],
        optimization: {
          realContentHash: true,
        },
      }
    },
  }
}
