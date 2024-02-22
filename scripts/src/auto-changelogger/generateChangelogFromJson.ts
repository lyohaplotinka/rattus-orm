import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { MONOREPO_ROOT_DIR } from '../utils/utils'
import type { ChangelogElement, Heading } from './types'

const filePath = resolve(MONOREPO_ROOT_DIR, 'CHANGELOG.md')

const HEADING_REGEX = /# \d{4}\/\d{2}\/\d{2}$/gm
const getHeading = (str: string): Heading => {
  const result = HEADING_REGEX.exec(str)
  if (!result) {
    throw new Error('No heading found')
  }

  return {
    text: result[0].replace('# ', '').trim(),
    indexStart: str.indexOf(result[0]),
    indexEnd: str.indexOf(result[0]) + result[0].length,
  }
}

export async function generateChangelogFromJson(changelogJson: Record<string, ChangelogElement[]>, dateStr: string) {
  let changelogFileContent = await readFile(filePath, 'utf8')
  const firstBlock = getHeading(changelogFileContent)
  const secondBlock = getHeading(changelogFileContent)
  const hasCurrentDate = firstBlock.text === dateStr

  if (hasCurrentDate) {
    changelogFileContent = changelogFileContent.slice(secondBlock.indexStart, changelogFileContent.length)
  } else {
    // eslint-disable-next-line
    console.log(`"${firstBlock.text}", "${dateStr}"`)
  }

  const changelogElements = changelogJson[dateStr]
  const newBlock = [`# ${dateStr}`]

  for (const changelogEl of changelogElements) {
    newBlock.push(
      `### ${changelogEl.packageName} (${changelogEl.packageVersion})`,
      ...changelogEl.commitMessages.map((commit) => `* ${commit}`),
    )
  }

  changelogFileContent = newBlock.join('\n') + '\n\n' + changelogFileContent
  await writeFile(filePath, changelogFileContent, 'utf8')
}
