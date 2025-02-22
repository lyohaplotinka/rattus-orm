import { getCommitsListFromLastRelease, hasAffectedFilesForPackage } from '../utils/git'
import { getPackageMeta } from '../utils/utils'
import type { ChangelogElement } from './types'

export async function getChangelogElementsForPackage(
  key: string,
): Promise<ChangelogElement | null> {
  const commits = await getCommitsListFromLastRelease(key)
  const meta = getPackageMeta(key)

  const commitMessages = commits.reduce<string[]>((result, commit) => {
    if (hasAffectedFilesForPackage(commit, key)) {
      result.push(
        commit.message.replace(
          /\(#(\d{0,5})\)$/,
          `([#$1](https://github.com/lyohaplotinka/rattus-orm/pull/$1))`,
        ),
      )
    }

    return result
  }, [])

  if (!commitMessages.length) {
    return null
  }

  return {
    packageName: meta.title,
    packageKey: meta.code,
    packageVersion: meta.packageJson.version!,
    commitMessages,
  }
}
