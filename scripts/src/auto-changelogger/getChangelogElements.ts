import { $ } from 'execa'
import { isEqual } from 'lodash-es'
import micromatch from 'micromatch'
import type { PackageJson } from 'type-fest'

import packagesMeta from '../../packagesMeta.json'
import type { PackageMeta } from '../types/types'
import { GitUtils, loadPackageJson } from '../utils/utils'
import type { ChangelogElement, Commit } from './types'

const RELEASE_COMMIT_PATTERN = 'release('

function getPackagePatternForFormat(pattern: string, format = '{ts,tsx,json}') {
  return `${pattern}/*.${format}`
}

async function getCommitsListFromLastRelease(): Promise<Commit[]> {
  const { stdout: releaseCommitHash } = await $`git log --format=format:%H --grep=${RELEASE_COMMIT_PATTERN} -n 1 main`
  const { stdout: commitsSinceReleaseString } = await $`git log --pretty=format:%s::::%H ${releaseCommitHash}...main`

  const commits = commitsSinceReleaseString.split('\n').map<Promise<Commit>>(async (commitString) => {
    const [message, hash] = commitString.split('::::')
    const { stdout: affectedFilesString } = await $`git diff-tree --no-commit-id --name-only ${hash} -r`
    return {
      message,
      hash,
      affectedFiles: affectedFilesString.split('\n'),
    }
  })

  return Promise.all(commits)
}

function getPackageJsonDifference(path: string, commit: Commit) {
  const currentPkg = JSON.parse(GitUtils.readFileFromCommit(path, commit.hash)) as PackageJson.PackageJsonStandard
  const prevPkg = JSON.parse(GitUtils.readFileFromCommit(path, commit.hash)) as PackageJson.PackageJsonStandard

  const checkedKeys: (keyof PackageJson.PackageJsonStandard)[] = [
    'dependencies',
    'exports',
    'version',
    'peerDependencies',
  ]
  return checkedKeys.some((key) => {
    return !isEqual(currentPkg[key], prevPkg[key])
  })
}

function hasAffectedFilesForPacakge(commit: Commit, meta: PackageMeta) {
  const isMatch = micromatch.matcher(getPackagePatternForFormat(meta.matchPattern), {
    ignore: ['**/(tsup)*', 'scripts/*'],
  })
  const matched = commit.affectedFiles.filter((file) => {
    if (!isMatch(file)) {
      return false
    }
    const isPackageJson = file.endsWith('package.json')
    if (isPackageJson) {
      return getPackageJsonDifference(file, commit)
    }
    return true
  })
  return matched.length > 0
}

export async function getChangelogElements(): Promise<ChangelogElement[]> {
  const commits = await getCommitsListFromLastRelease()

  const changesByPackage = Object.entries(packagesMeta).reduce<Record<string, ChangelogElement>>(
    (result, [key, meta]) => {
      const commitMessages = commits.reduce<string[]>((result, commit) => {
        if (hasAffectedFilesForPacakge(commit, meta)) {
          result.push(
            commit.message.replace(/\(#(\d{0,5})\)$/, `([#$1](https://github.com/lyohaplotinka/rattus-orm/pull/$1))`),
          )
        }

        return result
      }, [])

      if (!commitMessages.length) {
        return result
      }

      result[key] = {
        packageName: meta.title,
        packageKey: key,
        packageVersion: loadPackageJson(key).version!,
        commitMessages,
      }

      return result
    },
    {},
  )

  return Object.values(changesByPackage)
}
