import { createRequire } from 'node:module'
import yargs from "yargs/yargs";
import { spawn } from "node:child_process";
import { fileURLToPath } from 'node:url'

const args = yargs(process.argv).argv

export function require(path) {
  return createRequire(import.meta.url)(path)
}

export function getPackages(fallbackToAll = true) {
    const configuredProviders = require('../test/tested-providers.json')
    const configuredProvidersKeys = Object.keys(configuredProviders)

    let packagesOption = (args.packages ?? '').split(',')

    if (packagesOption.length === 1 && packagesOption[0].trim() === '') {
        packagesOption = fallbackToAll ? configuredProvidersKeys : []
    }
    if (!packagesOption.every((packageName) => configuredProvidersKeys.includes(packageName.trim()))) {
        throw new Error('Unknown package passed')
    }

    return packagesOption
}

export async function asyncSpawn(command, args = [], env = {}) {
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

export const dirname = (importMetaUrl) => fileURLToPath(new URL('.', importMetaUrl))
