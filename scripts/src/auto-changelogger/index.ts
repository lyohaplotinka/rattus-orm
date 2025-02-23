import { writeFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'

import { format } from 'date-fns/format'
import { uniq } from 'lodash-es'

import { MONOREPO_ROOT_DIR } from '../utils/utils'
import { generateChangelogFromJson } from './generateChangelogFromJson'
import { getChangelogElementsForPackage } from './getChangelogElements'
import type { ChangelogElement } from './types'

const CHANGELOG_JSON_PATH = `${MONOREPO_ROOT_DIR}/.yarn/pkgmeta/changelog.json`

async function getChangelog(): Promise<Record<string, ChangelogElement[]>> {
  const content = await readFile(CHANGELOG_JSON_PATH, 'utf8')
  return JSON.parse(content)
}

export async function updateChangelog(forPackage: string) {
  const changes = await getChangelogElementsForPackage(forPackage)
  if (!changes) {
    return
  }
  const date = format(new Date(), 'yyyy/MM/dd')
  const changelogJson = await getChangelog()

  if (!(date in changelogJson)) {
    changelogJson[date] = []
  }
  const commitRecord = changelogJson[date].find((elem) => elem.packageKey === forPackage)
  if (!commitRecord) {
    changelogJson[date].push(changes)
  } else {
    commitRecord.commitMessages = uniq([...commitRecord.commitMessages, ...changes.commitMessages])
  }

  writeFileSync(CHANGELOG_JSON_PATH, `${JSON.stringify(changelogJson, null, 2)}\n`, 'utf8')
  await generateChangelogFromJson(changelogJson, date)
}
