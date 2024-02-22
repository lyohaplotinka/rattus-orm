import { resolve } from 'node:path'

import { $, execaCommandSync } from 'execa'
import { isEqual } from 'lodash-es'
import micromatch from 'micromatch'
import type { PackageJson } from 'type-fest'

import { getPackageMeta, MONOREPO_ROOT_DIR } from './utils'

export type Commit = {
  message: string
  hash: string
  affectedFiles: string[]
}

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

export async function getCommitsListFromLastRelease(packageKey: string): Promise<Commit[]> {
  return GitUtils.getCommitsSincePattern(getCompareRelease(packageKey, true)).map<Commit>((commitString) => {
    const [message, hash] = commitString.split('::::')
    return {
      message,
      hash,
      affectedFiles: GitUtils.getCommitFilesList(hash),
    }
  })
}

export function hasAffectedFilesForPackage(commit: Commit, packageKey: string) {
  const meta = getPackageMeta(packageKey)
  const isMatch = micromatch.matcher(getPackagePatternForFormat(meta.matchPattern), {
    ignore: ['**/(tsup)*', 'scripts/*', 'test/*'],
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

export class GitUtils {
  public static async tag(tag: string) {
    return $`git tag ${tag}`
  }

  public static async add() {
    return $`git add -A`
  }

  public static async commit(message: string) {
    return $`git commit -m ${message}`
  }

  public static async pushTag(tag: string) {
    await this.tag(tag)
    return $`git push origin refs/tags/${tag}`
  }

  public static async push() {
    return $`git push`
  }

  public static readFileFromCommit(path: string, hash: string): string
  public static readFileFromCommit<T>(path: string, hash: string, processor: (stdout: string) => T): T
  public static readFileFromCommit(path: string, hash: string, processor?: (stdout: string) => any) {
    const { stdout } = execaCommandSync(`git --no-pager show ${hash}:${path}`, {
      cwd: MONOREPO_ROOT_DIR,
    })

    return processor ? processor(stdout) : stdout
  }

  public static getLastCommitByPattern(pattern: string): string | null {
    const { stdout } = $.sync`git log --format=format:%H --grep=${pattern} -n 1 main`
    return stdout || null
  }

  public static getCommitWherePathWasIntroduced(path: string, includeCommit = false): string {
    const { stdout } = $.sync`git log --format=format:%H --diff-filter=A -n 1 main -- ${path}`
    return includeCommit ? `${stdout}^` : stdout
  }

  public static getCommitsSincePattern(pattern: string): string[] {
    const { stdout } = $.sync`git log --pretty=format:%s::::%H ${pattern}...main`
    return stdout.split('\n')
  }

  public static getCommitFilesList(hash: string): string[] {
    const { stdout } = $.sync`git diff-tree --no-commit-id --name-only ${hash} -r`
    return stdout.split('\n')
  }

  public static getCurrentBranchName() {
    const res = $.sync`git rev-parse --abbrev-ref HEAD`
    return res.stdout.trim()
  }

  public static isOnMainBranch() {
    return this.getCurrentBranchName() === 'main'
  }
}
