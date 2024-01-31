import { $ } from 'execa'
import { ChangelogElement, Commit } from './types'
import micromatch from 'micromatch'
import packagesMeta from '../../packagesMeta.json'
import { findUpSync } from 'find-up'
import { resolve, dirname } from 'node:path'
import { readFileSync } from 'node:fs'

const RELEASE_COMMIT_PATTERN = 'release('

function getPackagePatternForFormat(pattern: string, format = '{ts,tsx,json}') {
  return `${pattern}/*.${format}`
}

function getPackageVersion(key: string) {
  if (!(key in packagesMeta)) {
    throw new Error(`Unknown package key "${key}"`)
  }
  const directory = packagesMeta[key].matchPattern.replace('/**', '')
  const yarnrcFile = findUpSync('.yarnrc.yml')
  if (!yarnrcFile) {
    throw new Error('Root monorepo dir not found')
  }
  const rootMonorepoDir = dirname(yarnrcFile)
  const pkgJsonPath = resolve(rootMonorepoDir, directory, 'package.json')
  return JSON.parse(readFileSync(pkgJsonPath, 'utf8')).version
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

export async function getChangelogElements(): Promise<ChangelogElement[]> {
  const commits = await getCommitsListFromLastRelease()

  const changesByPackage = Object.entries(packagesMeta).reduce<Record<string, ChangelogElement>>(
    (result, [key, meta]) => {
      const commitMessages = commits.reduce<string[]>((result, commit) => {
        if (micromatch(commit.affectedFiles, getPackagePatternForFormat(meta.matchPattern)).length) {
          result.push(commit.message)
        }

        return result
      }, [])

      if (!commitMessages.length) {
        return result
      }

      result[key] = {
        packageName: meta.title,
        packageKey: key,
        packageVersion: getPackageVersion(key),
        commitMessages,
      }

      return result
    },
    {},
  )

  return Object.values(changesByPackage)
}
