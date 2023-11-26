import { createRequire } from 'node:module'
import { spawn } from "node:child_process";
import { fileURLToPath } from 'node:url'
import { resolve } from "node:path";
import { readdir } from "node:fs/promises";

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

export async function asyncSpawn(command, args = [], env = {}, cwd = undefined) {
    return new Promise((resolve, reject) => {
        const spawnedProcess = spawn(command, args, { stdio: 'inherit', env: { ...process.env, ...env }, cwd })
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
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}
