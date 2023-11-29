import { spawn } from 'node:child_process'
import { readdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export function require(path) {
  return createRequire(import.meta.url)(path)
}

export function parsePackages(commaSeparatedString, filter = null) {
  const configuredProviders = require('./packagesMeta.json')
  const configuredProvidersKeys = Object.keys(configuredProviders)

  if (!commaSeparatedString || commaSeparatedString.trim() === 'all') {
    return filter ? configuredProvidersKeys.filter((pkg) => filter(configuredProviders[pkg])) : configuredProvidersKeys
  }

  const packagesOption = commaSeparatedString.split(',')
  packagesOption.forEach((packageName) => {
    if (!configuredProvidersKeys.includes(packageName)) {
      throw new Error(`Unknown package passed: "${packageName}"`)
    }
  })

  return filter ? packagesOption.filter((pkg) => filter(configuredProviders[pkg])) : packagesOption
}

/**
 *
 * @param {string} command - The command to run in the child process.
 * @param {string[]} [args=[]] - An array of arguments to pass to the command.
 * @param {Object} [options={}]
 * @param {Record<string, string>} [options.env={}] - Environment key-value pairs.
 * @param {string} [options.cwd=undefined] - The working directory of the command. If undefined, uses the current process's current directory.
 * @param {string|Array<string | WritableStream>} [options.stdio='inherit'] - Stdio configuration for the spawned process. It can be 'pipe', 'ignore', or 'inherit'.
 * @returns {Promise<void>} A promise that resolves if the command executes successfully, or rejects with an error message.
 */
export async function asyncSpawn(command, args = [], options) {
  const { env = {}, stdio = 'inherit', cwd = undefined } = options ?? {}

  return new Promise((resolve, reject) => {
    const spawnedProcess = spawn(command, args, { stdio, env: { ...process.env, ...env }, cwd })
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

export const dirname = (importMetaUrl) => fileURLToPath(new URL('.', importMetaUrl))

export async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true })
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name)
    if (dirent.isDirectory()) {
      yield* getFiles(res)
    } else {
      yield res
    }
  }
}
