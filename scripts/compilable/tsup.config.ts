import createTsupConfig from '../../tsup.config.base'

export default createTsupConfig(
  {
    docsBuilder: './api-docs-builder/docsBuilder.ts',
  },
  {
    format: 'esm',
    external: ['typescript', 'commander', 'lodash', 'lodash-es', '../../apiDocsFiles.json'],
  },
)
