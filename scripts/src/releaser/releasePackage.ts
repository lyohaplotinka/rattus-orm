/* eslint-disable no-console */

import enquirer from 'enquirer'
import type { ReleaseType } from 'semver'
import semver from 'semver'

import {
  getPackageMeta,
  GitUtils,
  loadPackageJson,
  updatePackageJson,
  writePackageJson,
  YarnUtils,
} from '../utils/utils'

const versionIncrements: ReleaseType[] = ['patch', 'minor', 'major']

process.on('unhandledRejection', (data) => {
  console.error(data)
  process.exit(1)
})

async function bumpDependents(packageName: string, newVersion: string, exclude = ['docs']) {
  const bumpingDep = `@rattus-orm/${packageName}`
  const yarnWorkspaces = await YarnUtils.listPackages()
  const allPackagesData = []

  for (const parsed of yarnWorkspaces) {
    try {
      if (
        parsed.location === '.' ||
        parsed.location.endsWith(packageName) ||
        exclude.some((excl) => parsed.location.endsWith(excl))
      ) {
        continue
      }

      allPackagesData.push(parsed)
    } catch (e) {
      console.error(e)
    }
  }

  for (const packageData of allPackagesData) {
    const pkg = loadPackageJson(packageData.location)

    for (const dep of ['dependencies', 'devDependencies', 'peerDependencies']) {
      if (!(dep in pkg) || Object.keys(pkg[dep]).length === 0) {
        continue
      }
      const deps = pkg[dep]
      for (const [depName, depVer] of Object.entries(deps)) {
        if (depName !== bumpingDep || depVer === 'workspace:^') {
          continue
        }

        pkg[dep][depName] = `^${newVersion}`
      }
    }

    writePackageJson(packageData.location, pkg)
  }
}

export async function runForPackage(packageName: string) {
  console.log(`\nReleasing package "${packageName}"\n`)

  const currentVersion = loadPackageJson(packageName).version!
  let targetVersion

  const { release } = await enquirer.prompt<{ release: string }>({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: versionIncrements.map((i) => `${i} (${semver.inc(currentVersion, i)})`).concat(['custom']),
  })

  if (release === 'custom') {
    targetVersion = (
      await enquirer.prompt<{ version: string }>({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion,
      })
    ).version
  } else {
    targetVersion = release.match(/\((.*)\)/)![1]
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`Invalid target version: ${targetVersion}`)
  }

  const { yes: versionOk } = await enquirer.prompt<{ yes: boolean }>({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`,
  })

  if (!versionOk) {
    return
  }

  const packageMeta = getPackageMeta(packageName)
  if (packageMeta.autoBump) {
    const { doAutoBump } = await enquirer.prompt<{ doAutoBump: boolean }>({
      type: 'confirm',
      name: 'doAutoBump',
      message: "This package has dependents, maybe you should bump it's version in them too. Do bumping?",
    })

    if (doAutoBump) {
      console.log('\nAuto-bump for dependents detected, bumping...')
      await bumpDependents(packageName, targetVersion)
    }
  }

  console.log('\nRunning tests...')
  await YarnUtils.test(packageName)

  console.log('\nUpdating the package version...')
  updatePackageJson(packageName, { version: targetVersion })

  console.log('\nCleaning...')
  await YarnUtils.runForPackage(packageName, 'clean')

  console.log('\nBuild...')
  await YarnUtils.runForPackage(packageName, 'build')

  console.log('\nCommitting changes...')
  await GitUtils.add()
  await GitUtils.commit(`release(${packageName}): v${targetVersion}`)

  console.log('\nPublishing the package...')
  await YarnUtils.publishPackage(packageName)

  // Push to GitHub.
  console.log('\nPushing to GitHub...')
  await GitUtils.pushTag(`${packageName}-v${targetVersion}`)
  await GitUtils.push()
}
