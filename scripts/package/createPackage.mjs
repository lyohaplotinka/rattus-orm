import { program } from "commander";
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve, join, dirname as pathDirname } from 'node:path'
import { dirname, getFiles, require } from "../utils.mjs";

const currentPath = dirname(import.meta.url)
const corePackageVersion = require(resolve(currentPath, '../../packages/core/package.json')).version
const templatesPath = resolve(currentPath, './_template')

program
  .name('createPackage.mjs')
  .description('Create new packge from template')
  .argument('<name>', 'Folder name for new package')
  .action(async (name) => {
    const packageName = name.trim()
    const newPackagePath = resolve(currentPath, `../../packages/${packageName}`)

    await mkdir(newPackagePath, { recursive: true })
    for await (const filePath of getFiles(templatesPath)) {
      const fileRelativeToTemplates = filePath.replace(templatesPath, '')
      const toSaveFile = join(newPackagePath, fileRelativeToTemplates)
      await mkdir(pathDirname(toSaveFile), { recursive: true })
      const content = await readFile(filePath, 'utf8')
      const fixedContent = content.replaceAll('{{ PACKAGE }}', packageName).replaceAll('{{ CORE_VERSION }}', corePackageVersion)
      writeFile(toSaveFile, fixedContent, 'utf8')
    }
  })

program.parse()
