/* eslint-disable no-console */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { dirname, extname, normalize, parse, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import chalk from 'chalk'
import { $, execaCommand, execaCommandSync } from 'execa'
import { findUpSync } from 'find-up'
import { merge } from 'lodash-es'
import type { PackageJson } from 'type-fest'

import { isPackageJsonWithRattusMeta } from '../types/guards'
import type { ExecaOptions, PackageMeta, YarnPackageListItem } from '../types/types'

export function dirName(importMetaUrl: string) {
  return dirname(fileURLToPath(importMetaUrl))
}

export const SCRIPTS_DIR = dirname(findUpSync('apiDocsFiles.json', { cwd: dirName(import.meta.url) })!)
export const MONOREPO_ROOT_DIR = dirname(findUpSync('.yarnrc.yml', { cwd: dirName(import.meta.url) })!)
export const MONOREPO_PACKAGES_PATH = resolve(MONOREPO_ROOT_DIR, 'packages')

export function readJson<T = any>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, 'utf8'))
}

export function loadPackagesMeta() {
  return readdirSync(MONOREPO_PACKAGES_PATH, { withFileTypes: true }).reduce<Record<string, PackageMeta>>(
    (result, entry) => {
      if (!entry.isDirectory()) {
        return result
      }
      const dirName = entry.name
      const packagePath = resolve(MONOREPO_PACKAGES_PATH, dirName)
      const packageJson = readJson(resolve(packagePath, 'package.json'))
      if (!isPackageJsonWithRattusMeta(packageJson)) {
        return result
      }

      const meta = packageJson.rattusMeta

      const testProvider =
        meta.testProvider === undefined || typeof meta.testProvider === 'boolean'
          ? meta.testProvider
          : {
              exportName: meta.testProvider.exportName,
              path: resolve(packagePath, meta.testProvider.path),
            }

      result[dirName] = {
        title: meta.title,
        code: dirName,
        matchPattern: `packages/${dirName}/**`,
        path: packagePath,
        testProvider,
        autoBumpDependents: meta.autoBumpDependents ?? false,
        order: meta.order ?? 9999,
      }

      return result
    },
    {},
  )
}

export function getPackageMeta(pkg: string): PackageMeta {
  const allMeta = loadPackagesMeta()
  if (!(pkg in allMeta)) {
    throw new Error(`No meta for package "${pkg}"`)
  }
  return allMeta[pkg]
}

export function sortPackages(packages: string[]) {
  return packages.sort((a, b) => {
    return getPackageMeta(a).order - getPackageMeta(b).order
  })
}

export function parsePackages(commaSeparatedString: string, filter: (pkg: PackageMeta) => boolean = () => true) {
  const configuredProviders = loadPackagesMeta()
  const configuredProvidersKeys = Object.keys(configuredProviders)

  if (!commaSeparatedString || commaSeparatedString.trim() === 'all') {
    return sortPackages(configuredProvidersKeys.filter((key) => filter(getPackageMeta(key))))
  }

  const packagesOption = commaSeparatedString.split(',')
  packagesOption.forEach((packageName) => {
    if (!configuredProvidersKeys.includes(packageName)) {
      throw new Error(`Unknown package passed: "${packageName}"`)
    }
  })

  return sortPackages(packagesOption.filter((key) => filter(getPackageMeta(key))))
}

export async function* getFiles(dir: string): AsyncGenerator<string> {
  const dirents = await readdir(dir, { withFileTypes: true })
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name)
    if (dirent.isDirectory()) {
      yield* getFiles(res)
    } else {
      yield res
    }
  }
}

export function getGitBranchName() {
  const res = $.sync`git rev-parse --abbrev-ref HEAD`
  return res.stdout.trim()
}

export function isOnMainBranch() {
  return getGitBranchName() === 'main'
}

export function getPackageJsonPath(packageDirName: string): string {
  const path = resolve(MONOREPO_ROOT_DIR, 'packages', packageDirName.replace('packages/', ''), 'package.json')
  if (!existsSync(path)) {
    throw new Error(`Not found package.json for "${packageDirName}"`)
  }
  return path
}

export function loadPackageJson(packageDirName: string): PackageJson.PackageJsonStandard {
  return readJson<PackageJson.PackageJsonStandard>(getPackageJsonPath(packageDirName))
}

export function writePackageJson(packageDirName: string, content: PackageJson.PackageJsonStandard) {
  writeFileSync(getPackageJsonPath(packageDirName), JSON.stringify(content, null, 2) + '\n', 'utf8')
}

export function updatePackageJson(
  packageDirName: string,
  newContent: Partial<PackageJson.PackageJsonStandard>,
): PackageJson.PackageJsonStandard {
  const merged = merge(loadPackageJson(packageDirName), newContent)
  writePackageJson(packageDirName, merged)
  return merged
}

export async function withRetry(func: () => any | Promise<any>, funcId = 'func', retries = 2) {
  try {
    console.log(chalk.yellowBright(`[withRetry] running ${funcId}, ${retries} attempts left`))
    return await func()
  } catch (error) {
    if (retries <= 0) {
      throw error
    }
    await new Promise((resolve) => setTimeout(resolve, 300))
    return withRetry(func, funcId, retries - 1)
  }
}

export function fileWithoutExtension(file: string) {
  return parse(file).name
}

export async function readDirContents(path: string, pwd?: string) {
  const realPath = pwd ? resolve(pwd, path) : path
  return readdir(realPath)
}

export function createTsupBuildEntries(files: string[], srcPath: string, prefix = '') {
  return files.reduce<Record<string, string>>((result, file) => {
    const noExt = fileWithoutExtension(file)
    result[normalize(`${prefix}/${noExt}`)] = normalize(`./${srcPath}/${file}`)
    return result
  }, {})
}

export function createExportsBlock(name: string, prefix?: string): PackageJson.Exports {
  const nameWithoutExtension = normalize(prefix + '/' + name.replace(extname(name), ''))

  return {
    [`./${nameWithoutExtension}`]: {
      import: `./dist/${nameWithoutExtension}.mjs`,
      require: `./dist/${nameWithoutExtension}.js`,
      types: `./dist/${nameWithoutExtension}.d.ts`,
    },
  }
}

export async function createBuildsAndExportsForFiles(dirPath: string, prefix?: string, pwd?: string) {
  const utilsDirContents = await readDirContents(dirPath, pwd)
  const patchPkgJsonWith = {
    exports: {},
  } satisfies PackageJson.PackageJsonStandard

  const buildEntries = createTsupBuildEntries(utilsDirContents, dirPath, prefix || undefined)
  for (const util of utilsDirContents) {
    Object.assign(patchPkgJsonWith.exports, createExportsBlock(util, prefix))
  }

  return {
    buildEntries,
    patchPkgJsonWith,
  }
}

export class GitUtils {
  public static async tag(tag: string) {
    return $`git tag ${tag}`
  }

  public static async add() {
    return $`git add -A`
  }

  public static async commit(message: string) {
    return $`git commit -m ${message}`
  }

  public static async pushTag(tag: string) {
    await this.tag(tag)
    return $`git push origin refs/tags/${tag}`
  }

  public static async push() {
    return $`git push`
  }

  public static readFileFromCommit(path: string, hash: string): string {
    const { stdout } = execaCommandSync(`git --no-pager show ${hash}:${path}`, {
      cwd: MONOREPO_ROOT_DIR,
    })

    return stdout
  }

  public static getLastCommitByPattern(pattern: string): string | null {
    const { stdout } = $.sync`git log --format=format:%H --grep=${pattern} -n 1 main`
    return stdout || null
  }

  public static getCommitWherePathWasIntroduced(path: string, includeCommit = false): string {
    const { stdout } = $.sync`git log --format=format:%H --diff-filter=A -n 1 main -- ${path}`
    return includeCommit ? `${stdout}^` : stdout
  }
}

export class YarnUtils {
  public static async listPackages(): Promise<YarnPackageListItem[]> {
    const result = await $`yarn workspaces list --json`
    return result.stdout.split('\n').map((part) => JSON.parse(part))
  }

  public static async runFunctionalTests(pkg: string, pattern: string = '', options?: ExecaOptions) {
    return execaCommand(`./node_modules/.bin/vitest run ${pattern}`, {
      ...options,
      env: {
        PACKAGE_NAME: pkg,
      },
    })
  }

  public static async testPackage(pkg: string, pattern: string = '', options?: ExecaOptions) {
    return execaCommand(`yarn workspace @rattus-orm/${pkg} run test ${pattern} --passWithNoTests`, options)
  }

  public static async test(pkg = 'all') {
    return $`yarn test ${pkg}`
  }

  public static async runForPackage(pkg: string, command: string) {
    return $`yarn workspace @rattus-orm/${pkg} run ${command}`
  }

  public static async publishPackage(pkg: string) {
    return execaCommand(`yarn workspace @rattus-orm/${pkg} npm publish --access public`, {
      shell: true,
      stdio: 'inherit',
    })
  }
}
