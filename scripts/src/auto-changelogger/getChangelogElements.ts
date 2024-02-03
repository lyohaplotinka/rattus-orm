import { $ } from 'execa'
import { isEqual } from 'lodash-es'
import micromatch from 'micromatch'
import type { PackageJson } from 'type-fest'

import packagesMeta from '../../packagesMeta.json'
import type { PackageMeta } from '../types/types'
import { GitUtils, loadPackageJson } from '../utils/utils'
import type { ChangelogElement, Commit } from './types'

const RELEASE_COMMIT_PATTERN = 'release('

function getReleaseCommitMessage(packageKey: string) {
  return `${RELEASE_COMMIT_PATTERN}${packageKey}`
}

function getPackagePatternForFormat(pattern: string, format = '{ts,tsx,json}') {
  return `${pattern}/*.${format}`
}

function getLastPackageReleaseHash(packageKey: string): string {
  const { stdout } = $.sync`git log --format=format:%H --grep=${getReleaseCommitMessage(packageKey)} -n 1 main`
  if (!stdout) {
    return getLastPackageReleaseHash('core')
  }

  return stdout
}

async function getCommitsListFromLastRelease(packageKey: string): Promise<Commit[]> {
  const { stdout: commitsSinceReleaseString } =
    await $`git log --pretty=format:%s::::%H ${getLastPackageReleaseHash(packageKey)}...main`

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

function getPackageJsonDifference(path: string, commit: Commit, packageKey: string) {
  const currentPkg = JSON.parse(GitUtils.readFileFromCommit(path, commit.hash)) as PackageJson.PackageJsonStandard
  const prevPkg = JSON.parse(
    GitUtils.readFileFromCommit(path, getLastPackageReleaseHash(packageKey)),
  ) as PackageJson.PackageJsonStandard

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

function hasAffectedFilesForPacakge(commit: Commit, packageKey: string, meta: PackageMeta) {
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
  const meta = packagesMeta[key]

  const commitMessages = commits.reduce<string[]>((result, commit) => {
    if (hasAffectedFilesForPacakge(commit, key, meta)) {
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
    packageKey: key,
    packageVersion: loadPackageJson(key).version!,
    commitMessages,
  }
}
