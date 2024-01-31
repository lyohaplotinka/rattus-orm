import chalk from 'chalk'
import { program } from 'commander'

import type { PackageMeta } from '../types/types'
import { parsePackages, withRetry, YarnUtils } from '../utils/utils'

async function runLocalTests(packageName: string, pattern: string, verbose: boolean) {
  return YarnUtils.testPackage(packageName, pattern, {
    stdio: ['pipe', verbose ? process.stdout : 'pipe', process.stderr],
  })
}

async function runFunctionalTests(packageName: string, pattern: string, verbose: boolean) {
  return YarnUtils.runFunctionalTests(packageName, pattern, {
    stdio: ['pipe', verbose ? process.stdout : 'pipe', process.stderr],
  })
}

program.name('test.mjs').description('Test orchestrator for Rattus ORM').version('0.0.1')

program
  .command('run-tests')
  .description('Run tests')
  .argument('[package]', 'for which packages we should run tests, comma-separated', 'all')
  .option('-sl, --skip-local', 'skip local tests (inside packages/<package> dir)', false)
  .option('-sf, --skip-functional', 'skip functional tests (inside ./tests)', false)
  .option('-v, --verbose', 'show test logs', false)
  .option('-lp, --local-pattern <pattern>', 'tests pattern for local tests', '')
  .option('-fp, --functional-pattern <pattern>', 'tests pattern for functional tests', '')
  .action(
    async (
      str: string,
      options: {
        skipLocal: boolean
        skipFunctional: boolean
        localPattern: string
        functionalPattern: string
        verbose: boolean
      },
    ) => {
      const { skipLocal, skipFunctional, localPattern, functionalPattern, verbose } = options
      const allPackagesNames = parsePackages(str, (pkg: PackageMeta) => {
        return pkg.runLocal !== false
      })
      const packagesNames = parsePackages(str, (pkg: PackageMeta) => {
        return !!pkg.runFunctional
      })
      const testsPromisesArray: Promise<void>[] = []
      const results: Record<string, string[]> = { Succeed: [], Failed: [] }

      if (!skipLocal) {
        console.log('Running local tests')
        const localTestsPromise = allPackagesNames.map(async (pkg: string) => {
          const resultIndicator = `${pkg} (local)`
          try {
            // @todo with retry because of floating bug in tests
            await withRetry(() => runLocalTests(pkg, localPattern, verbose), `local for ${pkg}`)
            results.Succeed.push(resultIndicator)
          } catch (e) {
            console.log(e)
            results.Failed.push(resultIndicator)
          }
        })
        testsPromisesArray.push(...localTestsPromise)
      }

      if (!skipFunctional) {
        const funcTestsPromise = packagesNames.map(async (pkg: string) => {
          const resultIndicator = `${pkg} (functional)`
          console.log(`Running functional for package ${pkg}`)
          try {
            await runFunctionalTests(pkg, functionalPattern, verbose)
            results.Succeed.push(resultIndicator)
          } catch (e) {
            console.log(e)
            results.Failed.push(resultIndicator)
          }
        })
        testsPromisesArray.push(...funcTestsPromise)
      }

      await Promise.all(testsPromisesArray)

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
    },
  )

program.parse(process.argv)
