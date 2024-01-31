import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { format } from 'date-fns/format'
import { readFile, writeFile } from 'fs/promises'

import { MONOREPO_ROOT_DIR } from '../utils/utils'
import type { ChangelogElement } from './types'

export class ChangelogMarkdownService {
  protected changelogFilePath: string
  protected changelogFileContent: string
  protected changelogElements: ChangelogElement[]

  public async boot() {
    try {
      const filePath = resolve(MONOREPO_ROOT_DIR, 'CHANGELOG.md')
      if (!existsSync(filePath)) {
        throw new Error('Changelog not found')
      }
      this.changelogFilePath = filePath
      this.changelogFileContent = await readFile(this.changelogFilePath, 'utf8')
    } catch (e) {
      throw e
    }

    return this
  }

  public setElements(elements: ChangelogElement[]) {
    this.changelogElements = elements
    return this
  }

  public async write() {
    const block = this.produceBlock()
    const newContent = block + '\n\n' + this.changelogFileContent
    await writeFile(this.changelogFilePath, newContent, 'utf8')
  }

  protected produceBlock(): string {
    const linesArray: string[] = [
      `# ${format(new Date(), 'yyyy/MM/dd')}\n`,
      ...this.changelogElements.map(this.producePackageBlock),
    ]

    return linesArray.join('').trim()
  }

  protected producePackageBlock({ packageVersion, packageName, commitMessages }: ChangelogElement) {
    return `### ${packageName} (${packageVersion})\n` + commitMessages.map((msg) => `* ${msg}\n`).join('\n') + '\n'
  }
}
