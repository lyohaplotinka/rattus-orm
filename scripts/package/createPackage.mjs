import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname as pathDirname, join, resolve } from 'node:path'

import { program } from 'commander'

import { asyncSpawn, dirname, getFiles, require } from '../utils.mjs'

const currentPath = dirname(import.meta.url)
const corePackageVersion = require(resolve(currentPath, '../../packages/core/package.json')).version
const utilsPackageVersion = require(resolve(currentPath, '../../packages/utils/package.json')).version
const templatesPath = resolve(currentPath, './_template')

program
  .name('createPackage.mjs')
  .description('Create new package from template')
  .argument('<name>', 'Folder name for new package')
  .action(async (name) => {
    const packageName = name.trim()
    const newPackagePath = resolve(currentPath, `../../packages/${packageName}`)

    await mkdir(newPackagePath, { recursive: true })
    const fileWritePromises = []
    for await (const filePath of getFiles(templatesPath)) {
      const fileRelativeToTemplates = filePath.replace(templatesPath, '')
      const toSaveFile = join(newPackagePath, fileRelativeToTemplates)
      await mkdir(pathDirname(toSaveFile), { recursive: true })
      const content = await readFile(filePath, 'utf8')
      const fixedContent = content
        .replaceAll('{{ PACKAGE }}', packageName)
        .replaceAll('{{ CORE_VERSION }}', corePackageVersion)
        .replaceAll('{{ UTILS_VERSION }}', utilsPackageVersion)
        .replaceAll('// @ts-ignore', '')
      fileWritePromises.push(writeFile(toSaveFile, fixedContent, 'utf8'))
    }

    await Promise.all(fileWritePromises)
    await asyncSpawn('yarn', ['link'])
  })

program.parse()
