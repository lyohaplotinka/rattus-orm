import chalk from 'chalk'
import { program } from 'commander'

import { isOnMainBranch, parsePackages } from '../utils.mjs'
import { runForPackage } from './release-package.mjs'

program.name('releaser.mjs').description('Release script for Rattus ORM').version('0.0.1')

program
  .command('release')
  .description('Release a new version to NPM and GitHub')
  .argument('<packages>', 'packages to release, comma-separated')
  .action(async (packages) => {
    if (!isOnMainBranch()) {
      console.log(chalk.redBright('You are not on main branch. Please switch to "main"'))
      process.exit()
    }

    const forPackages = parsePackages(packages)
    if (!forPackages.length) {
      console.log('Pass --packages option')
      process.exit()
    }

    for (const packageName of forPackages) {
      await runForPackage(packageName)
    }
  })

program.parse()
