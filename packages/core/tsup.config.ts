import { createBuildsAndExportsForFiles, dirName, updatePackageJson } from '@scripts/utils.mjs'

import createTsupConfig from '../../tsup.config.base'

const { buildEntries, patchPkgJsonWith } = await createBuildsAndExportsForFiles(
  './shared-utils',
  'utils',
  dirName(import.meta.url),
)

export default createTsupConfig(
  {
    'rattus-orm-core': './src/index.ts',
    'object-data-provider': './src/object-data-provider.ts',
    decorators: './src/decorators.ts',
    ...buildEntries,
  },
  {
    splitting: true,
    async onSuccess() {
      updatePackageJson('core', patchPkgJsonWith)
    },
  },
)
