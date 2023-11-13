import yargs from 'yargs/yargs';
import { asyncSpawn, getPackages } from "./utils.mjs";

const args = yargs(process.argv).argv

async function runFunctionalTest(packageName) {
  return asyncSpawn('vitest', ['run'], { PACKAGE_NAME: packageName })
}

async function run() {
  const results = { Succeed: [], Failed: [] }

  if (!args.skipLocal) {
    console.log('Running local tests')
    try {
      await asyncSpawn('yarn', ['workspaces', 'foreach', '-A', 'run', 'test', '--passWithNoTests'])
      results.Succeed.push('<<Local tests>>')
    } catch (e) {
      results.Failed.push('<<Local tests>>')
    }
  }

  if (!args.onlyLocal) {
    for (const packageName of getPackages()) {
      console.log(`Running for package ${packageName}`)
      try {
        await runFunctionalTest(packageName)
        results.Succeed.push(packageName)
      } catch (e) {
        results.Failed.push(packageName)
      }
    }
  }

  const hasFailed = results.Failed.length > 0
  results.Succeed = results.Succeed.join(', ')
  results.Failed = results.Failed.join(', ')

  console.table(results)

  process.exit(hasFailed ? 1 : 0)
}

run()
