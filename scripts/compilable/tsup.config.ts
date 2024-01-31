import createTsupConfig from '../../tsup.config.base'

export default createTsupConfig(
  {
    docsBuilder: './api-docs-builder/docsBuilder.ts',
    autoChangelogger: './auto-changelogger/index.ts',
  },
  {
    format: 'esm',
    skipNodeModulesBundle: true,
  },
)
