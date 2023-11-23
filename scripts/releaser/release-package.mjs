import fs from 'fs'
import semver from 'semver'
import enquirer from 'enquirer'
import { resolve } from 'node:path'
import {asyncSpawn, dirname, require} from "../utils.mjs";

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

    console.log('\nRunning tests...')
    await asyncSpawn('yarn', ['test', '--skipLocal', `--packages=${packageName}`])
    await asyncSpawn('yarn', ['workspace', `@rattus-orm/${packageName}`, 'run', 'test'])

    console.log('\nUpdating the package version...')
    updatePackage(packageJsonPath, targetVersion)

    console.log('\nBuild...')
    await asyncSpawn('yarn', ['workspace', `@rattus-orm/${packageName}`, 'run', 'build'])

    console.log('\nCommitting changes...')
    await asyncSpawn('git', ['add', '-A'])
    await asyncSpawn('git', ['commit', '-m', `release(${packageName}): v${targetVersion}`])

    console.log('\nPublishing the package...')
    await asyncSpawn('yarn', [
        'workspace',
        `@rattus-orm/${packageName}`,
        'npm',
        'publish',
        '--access',
        'public'
    ])

    // Push to GitHub.
    console.log('\nPushing to GitHub...')
    await asyncSpawn('git', ['tag', `${packageName}-v${targetVersion}`])
    await asyncSpawn('git', ['push', 'origin', `refs/tags/${packageName}-v${targetVersion}`])
    await asyncSpawn('git', ['push'])
}
