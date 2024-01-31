/* eslint-disable no-console */

import { execSync, spawn } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { dirname, extname, normalize, parse, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { StdioOptions } from 'child_process'
import { findUpSync } from 'find-up'
import { merge } from 'lodash-es'
import type { PackageJson } from 'type-fest'

import type { PackageMeta } from '../types/types'

export function dirName(importMetaUrl: string) {
  return dirname(fileURLToPath(importMetaUrl))
}

export const PACKAGES_META_PATH = findUpSync('packagesMeta.json', { cwd: dirName(import.meta.url) })!
export const SCRIPTS_DIR = dirname(PACKAGES_META_PATH)
export const MONOREPO_ROOT_DIR = dirname(findUpSync('.yarnrc.yml', { cwd: dirName(import.meta.url) })!)

export function readJson<T = any>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, 'utf8'))
}

export function loadPackagesMeta(): Record<string, PackageMeta> {
  return readJson<Record<string, PackageMeta>>(PACKAGES_META_PATH)
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
    const pkgAOrder = getPackageMeta(a).order ?? 9999
    const pkgBOrder = getPackageMeta(b).order ?? 9999

    return pkgAOrder - pkgBOrder
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

type AsyncSpawnOpts = Partial<{
  env: Record<string, string>
  cwd: string
  stdio: StdioOptions
}>
export async function asyncSpawn(
  command: string,
  args: string[] = [],
  options: AsyncSpawnOpts = {},
): Promise<string[]> {
  const { env = {}, stdio = 'inherit', cwd } = options

  return new Promise((resolve, reject) => {
    const spawnedProcess = spawn(command, args, { stdio, env: { ...process.env, ...env }, cwd })
    const result: string[] = []

    spawnedProcess.on('error', (error) => {
      reject(error)
    })
    spawnedProcess.on('close', (code) => {
      if (code === 0) {
        resolve(result)
      } else {
        reject(`Process finished with exit code ${code}`)
      }
    })

    if (spawnedProcess.stdout) {
      spawnedProcess.stdout.on('data', (msg) => {
        result.push(...msg.toString().trim().split('\n'))
      })
    }
  })
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
  const res = execSync('git rev-parse --abbrev-ref HEAD')
  return res.toString().trim()
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

export async function withRetry(func: () => any | Promise<any>, retries = 3) {
  let attempts = 0
  let lastError: any = null

  const runFn = async (): Promise<any> => {
    if (attempts >= retries) {
      throw lastError
    }

    try {
      console.log(`Trying to execute func, attempt ${attempts + 1} of ${retries}`)
      return await func()
    } catch (e) {
      lastError = e
      attempts++
      return runFn()
    }
  }

  return runFn()
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
