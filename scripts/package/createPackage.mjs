import yargs from 'yargs/yargs';
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve, join, dirname as pathDirname } from 'node:path'
import {dirname, getFiles, require} from "../utils.mjs";

const args = yargs(process.argv).argv

if (!args.name) {
  console.error('Specify package name (--name=<name>)')
}

const packageName = args.name.trim()
const currentPath = dirname(import.meta.url)
const corePackageVersion = require(resolve(currentPath, '../../packages/core/package.json')).version
const templatesPath = resolve(currentPath, './_template')
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
