/* eslint-disable no-console */

import chalk from 'chalk'
import { program } from 'commander'

import { GitUtils } from '../utils/git'
import { getAffectedPackages, parsePackages } from '../utils/utils'
import { runForPackage } from './releasePackage'

program.name('releaser.mjs').description('Release script for Rattus ORM').version('0.0.1')

program
  .command('release')
  .description('Release a new version to NPM and GitHub')
  .argument('[packages]', 'packages to release, comma-separated')
  .option('-a, --affected', 'release affected packages only', false)
  .action(async (packages, { affected }) => {
    const forPackages =
      affected && !packages ? await getAffectedPackages() : parsePackages(packages)
    if (!forPackages.length) {
      console.log('Pass --packages option')
      process.exit()
    }

    console.log(chalk.blueBright(`Releasing ${forPackages.join(', ')}`))
    if (!GitUtils.isOnMainBranch()) {
      console.log(chalk.redBright('You are not on main branch. Please switch to "main"'))
      process.exit()
    }

    const released: string[] = []
    const failed: string[] = []

    for (const packageName of forPackages) {
      try {
        await runForPackage(packageName)
        released.push(packageName)
      } catch (e) {
        console.error(e)
        failed.push(packageName)
      }
    }

    released.length && console.log(chalk.greenBright(`Success: ${released.join(', ')}`))
    failed.length && console.log(chalk.redBright(`Failed: ${failed.join(', ')}`))
  })

program.parse()
