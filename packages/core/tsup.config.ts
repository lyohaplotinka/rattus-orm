import { createBuildsAndExportsForFiles, dirName, patchPackageJson } from '@scripts/nodeUtils'

import createTsupConfig from '../../tsup.config.base'

const __dirname = dirName(import.meta.url)
const { buildEntries, patchPkgJsonWith } = await createBuildsAndExportsForFiles('./shared-utils', 'utils', __dirname)

export default createTsupConfig(
  {
    'rattus-orm-core': './src/index.ts',
    'object-data-provider': './src/object-data-provider.ts',
    'rattus-context': './src/rattus-context.ts',
    ...buildEntries,
  },
  {
    splitting: true,
    async onSuccess() {
      await patchPackageJson('./package.json', patchPkgJsonWith, __dirname)
    },
  },
)
