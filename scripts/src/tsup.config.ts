import createTsupConfig from '../../tsup.config.base'

export default createTsupConfig(
  {
    docsBuilder: './api-docs-builder/docsBuilder.ts',
    utils: './utils/utils.ts',
    createPackage: './package/createPackage.ts',
    releaser: './releaser/releaser.ts',
  },
  {
    format: 'esm',
    skipNodeModulesBundle: true,
    splitting: true,
    outDir: '../built',
  },
)
