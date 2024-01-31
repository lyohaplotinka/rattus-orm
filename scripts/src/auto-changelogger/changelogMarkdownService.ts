import { format } from 'date-fns/format'
import { findUp } from 'find-up'
import { readFile, writeFile } from 'fs/promises'

import type { ChangelogElement } from './types'

export class ChangelogMarkdownService {
  protected changelogFilePath: string
  protected changelogFileContent: string
  protected changelogElements: ChangelogElement[]

  public async boot() {
    try {
      const filePath = await findUp('CHANGELOG.md')
      if (!filePath) {
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
