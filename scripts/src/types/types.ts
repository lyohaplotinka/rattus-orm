import { Options as ExecaOptions } from 'execa'
import type { PackageJson } from 'type-fest'

export type TestProviderConfig = {
  path: string
  exportName: string
}

export type PackageMeta = {
  title: string
  code: string
  matchPattern: string
  path: string
  testProvider: TestProviderConfig | false
  autoBumpDependents: boolean
  order: number
  packageJson: PackageJsonWithRattusMeta
  publishDir: string | null
}

export type PackageJsonWithRattusMeta = PackageJson.PackageJsonStandard & { rattusMeta: PackageMeta }

export type YarnPackageListItem = {
  location: string
  name: string
}

export { ExecaOptions }
