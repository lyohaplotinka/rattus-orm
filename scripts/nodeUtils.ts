import { fileURLToPath } from 'node:url'
import { resolve, dirname, extname, normalize } from 'node:path'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { merge } from 'lodash-es'
import { PackageJson } from 'type-fest'

export const fileName = (importMetaUrl: string) => fileURLToPath(importMetaUrl)

export const dirName = (importMetaUrl: string) => dirname(fileURLToPath(importMetaUrl))

export const getNodeGlobals = (importMetaUrl: string) => {
  return {
    __dirname: dirName(importMetaUrl),
    __filename: fileName(importMetaUrl),
  }
}

export const fileWithoutExtension = (file: string) => file.replace(extname(file), '')

export const readDirContents = async (path: string, pwd?: string) => {
  const realPath = pwd ? resolve(pwd, path) : path
  return readdir(realPath)
}

export const createExportsBlock = (name: string, prefix?: string): PackageJson.Exports => {
  const nameWithoutExtension = normalize(prefix + '/' + name.replace(extname(name), ''))

  return {
    [`./${nameWithoutExtension}`]: {
      import: `./dist/${nameWithoutExtension}.mjs`,
      require: `./dist/${nameWithoutExtension}.js`,
      types: `./dist/${nameWithoutExtension}.d.ts`,
    },
  }
}

export const patchPackageJson = async (pkgPath: string, patchWith: PackageJson.PackageJsonStandard, pwd?: string) => {
  const realPath = pwd ? resolve(pwd, pkgPath) : pkgPath
  const content: PackageJson.PackageJsonStandard = JSON.parse(await readFile(realPath, 'utf8'))
  const newContent = merge(content, patchWith)
  await writeFile(realPath, JSON.stringify(newContent, null, 2) + '\n')
}

export const createTsupBuildEntries = (files: string[], srcPath: string, prefix = '') =>
  files.reduce<Record<string, string>>((result, file) => {
    const noExt = fileWithoutExtension(file)
    result[normalize(`${prefix}/${noExt}`)] = normalize(`./${srcPath}/${file}`)
    return result
  }, {})

export const createBuildsAndExportsForFiles = async (dirPath: string, prefix?: string, pwd?: string) => {
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
