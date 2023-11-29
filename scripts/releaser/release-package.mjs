import { resolve } from 'node:path'

import enquirer from 'enquirer'
import fs from 'fs'
import semver from 'semver'

import { asyncSpawn, dirname, getPackageMeta, require } from '../utils.mjs'

const versionIncrements = ['patch', 'minor', 'major']

process.on('unhandledRejection', (data) => {
  console.error(data)
  process.exit(1)
})

function updatePackage(packageJsonPath, version) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

  pkg.version = version

  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n')
}

async function bumpDependents(packageName, newVersion, exclude = ['docs']) {
  const bumpingDep = `@rattus-orm/${packageName}`
  const yarnWsListOutput = await asyncSpawn('yarn', ['workspaces', 'list', '--json'], { stdio: 'pipe' })
  const allPackagesData = []

  for (const line of yarnWsListOutput) {
    try {
      const parsed = JSON.parse(line)
      if (
        parsed.location === '.' ||
        parsed.location.endsWith(packageName) ||
        exclude.some((excl) => parsed.location.endsWith(excl))
      ) {
        continue
      }

      allPackagesData.push(parsed)
    } catch (e) {
      console.log(e)
    }
  }

  for (const packageData of allPackagesData) {
    const packageJsonPath = resolve(dirname(import.meta.url), `../../${packageData.location}/package.json`)
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

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

    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8')
  }
}

export async function runForPackage(packageName) {
  console.log(`\nReleasing package "${packageName}"\n`)

  const packageJsonPath = resolve(dirname(import.meta.url), `../../packages/${packageName}/package.json`)
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`Package ${packageName} does not exists`)
  }

  const currentVersion = require(packageJsonPath).version
  let targetVersion

  const { release } = await enquirer.prompt({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: versionIncrements.map((i) => `${i} (${semver.inc(currentVersion, i)})`).concat(['custom']),
  })

  if (release === 'custom') {
    targetVersion = (
      await enquirer.prompt({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion,
      })
    ).version
  } else {
    targetVersion = release.match(/\((.*)\)/)[1]
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`Invalid target version: ${targetVersion}`)
  }

  const { yes: versionOk } = await enquirer.prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`,
  })

  if (!versionOk) {
    return
  }

  const packageMeta = getPackageMeta(packageName)
  if (packageMeta.autoBump) {
    console.log('\nAuto-bump for dependents detected, bumping...')
    await bumpDependents(packageName, targetVersion)
  }

  console.log('\nRunning tests...')
  await asyncSpawn('yarn', ['test', packageName])

  console.log('\nUpdating the package version...')
  updatePackage(packageJsonPath, targetVersion)

  console.log('\nCleaning...')
  await asyncSpawn('yarn', ['workspace', `@rattus-orm/${packageName}`, 'run', 'clean'])

  console.log('\nBuild...')
  await asyncSpawn('yarn', ['workspace', `@rattus-orm/${packageName}`, 'run', 'build'])

  console.log('\nCommitting changes...')
  await asyncSpawn('git', ['add', '-A'])
  await asyncSpawn('git', ['commit', '-m', `release(${packageName}): v${targetVersion}`])

  console.log('\nPublishing the package...')
  await asyncSpawn('yarn', ['workspace', `@rattus-orm/${packageName}`, 'npm', 'publish', '--access', 'public'])

  // Push to GitHub.
  console.log('\nPushing to GitHub...')
  await asyncSpawn('git', ['tag', `${packageName}-v${targetVersion}`])
  await asyncSpawn('git', ['push', 'origin', `refs/tags/${packageName}-v${targetVersion}`])
  await asyncSpawn('git', ['push'])
}
