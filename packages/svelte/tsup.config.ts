import path from 'node:path'

import createTsupConfig from '../../tsup.config.base'

export default createTsupConfig(
  {
    'rattus-orm-svelte-provider': './src/index.ts',
  },
  {
    external: ['svelte'],
    esbuildPlugins: [
      {
        name: 'svelteCopy',
        setup(build) {
          build.onResolve({ filter: /\.svelte$/ }, async (args) => {
            return {
              path: path.join('../components/', args.path),
              external: true,
            }
          })
        },
      },
    ],
  },
)
