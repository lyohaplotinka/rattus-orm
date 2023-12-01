import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import createTsupConfig from '../../tsup.config.base'
import packageJson from './package.json'

const pkg = packageJson as Record<string, any>

export const dirname = fileURLToPath(new URL('.', import.meta.url))

const utilsList: Record<string, string> = {
  createBasicProviderTest: './src/createBasicProviderTest.ts',
  isUnknownRecord: './src/isUnknownRecord.ts',
  pickFromClass: './src/pickFromClass.ts',
  vueComputedUtils: './src/vueComputedUtils.ts',
  sharedTypes: './src/types.ts',
}

const createExportsBlock = (name: string) => ({
  [`./${name}`]: {
    import: `./dist/${name}.mjs`,
    require: `./dist/${name}.js`,
    types: `./dist/${name}.d.ts`,
  },
})

export default createTsupConfig(
  { ...utilsList },
  {
    async onSuccess() {
      pkg.exports = {}

      for (const util in utilsList) {
        Object.assign(pkg.exports, createExportsBlock(util))
      }

      await writeFile('./package.json', JSON.stringify(pkg, null, 2) + '\n', 'utf-8')
    },
    splitting: true,
  },
)
