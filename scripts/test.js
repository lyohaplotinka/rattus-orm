const args = require('yargs').argv
const configuredProviders = require('../test/tested-providers.json')
const configuredProvidersKeys = Object.keys(configuredProviders)
const spawn = require('node:child_process').spawn

let packagesOption = (args.packages ?? '').split(',')

if (packagesOption.length === 1 && packagesOption[0].trim() === '') {
  packagesOption = configuredProvidersKeys
}
if (!packagesOption.every((packageName) => configuredProvidersKeys.includes(packageName.trim()))) {
  throw new Error('Unknown package passed')
}

function log(...messages) {
  console.log(':: ', ...messages, ' ::')
}

async function asyncSpawn(command, args, env) {
  return new Promise((resolve, reject) => {
    const spawnedProcess = spawn(command, args, { stdio: 'inherit', env: { ...process.env, ...env } })
    spawnedProcess.on('error', (error) => {
      reject(error)
    })
    spawnedProcess.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(`Process finished with exit code ${code}`)
      }
    })
  })
}

async function runFunctionalTest(packageName) {
  return asyncSpawn('vitest', ['run'], { PACKAGE_NAME: packageName })
}

async function run() {
  const results = { Succeed: [], Failed: [] }

  if (!args.skipLocal) {
    log('Running local tests')
    try {
      await asyncSpawn('yarn', ['workspaces', 'foreach', '-A', 'run', 'test', '--passWithNoTests'])
      results.Succeed.push('<<Local tests>>')
    } catch (e) {
      results.Failed.push('<<Local tests>>')
    }
  }

  if (!args.onlyLocal) {
    for (const packageName of packagesOption) {
      log(`Running for package ${packageName}`)
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
