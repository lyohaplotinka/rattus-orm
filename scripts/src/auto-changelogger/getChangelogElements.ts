import { resolve } from 'node:path'

import { isEqual } from 'lodash-es'
import micromatch from 'micromatch'
import type { PackageJson } from 'type-fest'

import type { PackageMeta } from '../types/types'
import { getPackageMeta, GitUtils, MONOREPO_ROOT_DIR } from '../utils/utils'
import type { ChangelogElement, Commit } from './types'

const RELEASE_COMMIT_PATTERN = 'release('

function getReleaseCommitMessage(packageKey: string) {
  return `${RELEASE_COMMIT_PATTERN}${packageKey}`
}

function getPackagePatternForFormat(pattern: string, format = '{ts,tsx,json}') {
  return `${pattern}/*.${format}`
}

function getCompareRelease(packageKey: string, includeCommit = false): string {
  return (
    GitUtils.getLastCommitByPattern(getReleaseCommitMessage(packageKey)) ||
    GitUtils.getCommitWherePathWasIntroduced(resolve(MONOREPO_ROOT_DIR, `packages/${packageKey}`), includeCommit)
  )
}

async function getCommitsListFromLastRelease(packageKey: string): Promise<Commit[]> {
  return GitUtils.getCommitsSincePattern(getCompareRelease(packageKey, true)).map<Commit>((commitString) => {
    const [message, hash] = commitString.split('::::')
    return {
      message,
      hash,
      affectedFiles: GitUtils.getCommitFilesList(hash),
    }
  })
}

function getPackageJsonDifference(path: string, commit: Commit, packageKey: string) {
  const currentPkg = GitUtils.readFileFromCommit<PackageJson.PackageJsonStandard>(path, commit.hash, JSON.parse)
  const prevPkg = GitUtils.readFileFromCommit<PackageJson.PackageJsonStandard>(
    path,
    getCompareRelease(packageKey),
    JSON.parse,
  )

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

function hasAffectedFilesForPackage(commit: Commit, packageKey: string, meta: PackageMeta) {
  const isMatch = micromatch.matcher(getPackagePatternForFormat(meta.matchPattern), {
    ignore: ['**/(tsup)*', 'scripts/*'],
  })
  const matched = commit.affectedFiles.filter((file) => {
    if (!isMatch(file)) {
      return false
    }
    const isPackageJson = file.endsWith('package.json')
    if (isPackageJson) {
      return getPackageJsonDifference(file, commit, packageKey)
    }
    return true
  })
  return matched.length > 0
}

export async function getChangelogElementsForPackage(key: string): Promise<ChangelogElement | null> {
  const commits = await getCommitsListFromLastRelease(key)
  const meta = getPackageMeta(key)

  const commitMessages = commits.reduce<string[]>((result, commit) => {
    if (hasAffectedFilesForPackage(commit, key, meta)) {
      result.push(
        commit.message.replace(/\(#(\d{0,5})\)$/, `([#$1](https://github.com/lyohaplotinka/rattus-orm/pull/$1))`),
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
