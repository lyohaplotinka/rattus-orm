import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname as pathDirname, join, resolve } from 'node:path'

import { program } from 'commander'

import { asyncSpawn, getFiles, loadPackageJson, MONOREPO_ROOT_DIR, SCRIPTS_DIR } from '../utils/utils'

const corePackageVersion = loadPackageJson('core').version!
const templatesPath = resolve(SCRIPTS_DIR, 'templates/package')

program
  .name('createPackage.mjs')
  .description('Create new package from template')
  .argument('<name>', 'Folder name for new package')
  .action(async (name) => {
    const packageName = name.trim()
    const newPackagePath = resolve(MONOREPO_ROOT_DIR, `packages/${packageName}`)

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
        .replaceAll('// @ts-ignore', '')
      fileWritePromises.push(writeFile(toSaveFile, fixedContent, 'utf8'))
    }

    await Promise.all(fileWritePromises)
    await asyncSpawn('yarn', ['link'])
  })

program.parse()
