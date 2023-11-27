import chalk from 'chalk'
import { program } from 'commander'

import { asyncSpawn, parsePackages } from './utils.mjs'

async function runLocalTests(packageName, pattern) {
  return asyncSpawn('yarn', ['workspace', `@rattus-orm/${packageName}`, 'run', 'test', pattern, '--passWithNoTests'])
}

async function runFunctionalTests(packageName, pattern) {
  return asyncSpawn('./node_modules/.bin/vitest', ['run', pattern], { PACKAGE_NAME: packageName })
}

program.name('test.mjs').description('Test orchestrator for Rattus ORM').version('0.0.1')

program
  .command('run-tests')
  .description('Run tests')
  .argument('[package]', 'for which packages we should run tests, comma-separated', 'all')
  .option('-sl, --skip-local', 'skip local tests (inside packages/<package> dir)', false)
  .option('-sf, --skip-functional', 'skip functional tests (inside ./tests)', false)
  .option('-lp, --local-pattern <pattern>', 'tests pattern for local tests', '')
  .option('-fp, --functional-pattern <pattern>', 'tests pattern for functional tests', '')
  .action(async (str, { skipLocal, skipFunctional, localPattern, functionalPattern }) => {
    const packagesNames = parsePackages(str, (pkg) => {
      return !!pkg.runFunctional
    })
    const results = { Succeed: [], Failed: [] }

    if (!skipLocal) {
      console.log('Running local tests')
      for (const pkg of packagesNames) {
        const resultIndicator = `${pkg} (local)`
        try {
          await runLocalTests(pkg, localPattern)
          results.Succeed.push(resultIndicator)
        } catch (e) {
          console.log(e)
          results.Failed.push(resultIndicator)
        }
      }
    }

    if (!skipFunctional) {
      for (const pkg of packagesNames) {
        const resultIndicator = `${pkg} (functional)`
        console.log(`Running functional for package ${pkg}`)
        try {
          await runFunctionalTests(pkg, functionalPattern)
          results.Succeed.push(resultIndicator)
        } catch (e) {
          console.log(e)
          results.Failed.push(resultIndicator)
        }
      }
    }

    const hasFailed = results.Failed.length > 0

    if (results.Succeed.length > 0) {
      console.log(chalk.bgGreenBright.bold('\nSucceed tests:\n'))
      console.log(chalk.greenBright(results.Succeed.join('\n')))
    }
    if (results.Failed.length > 0) {
      console.log(chalk.bgRedBright.bold('\nFailed tests:\n'))
      console.log(chalk.redBright(results.Failed.join('\n')))
    }

    process.exit(hasFailed ? 1 : 0)
  })

program.parse()
