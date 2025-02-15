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
    'field-types': './src/attributes/field-types.ts',
    'field-relations': './src/attributes/field-relations.ts',
    ...buildEntries,
  },
  {
    splitting: true,
    async onSuccess() {
      updatePackageJson('core', patchPkgJsonWith)
    },
  },
)
