import micromatch from 'micromatch'

export default (allStagedFiles) => {
  const commands = []

  const coreMatch = micromatch(allStagedFiles, ['**/core/**/*.{ts,tsx}'])
  const utilsMatch = micromatch(allStagedFiles, ['**/utils/**/*.{ts,tsx}'])
  const allTesting = coreMatch.length > 0 || utilsMatch.length > 0
  const hasTsTsx = micromatch(allStagedFiles, ['**/*.{ts,tsx}']).length > 0
  const hasScripts = micromatch(allStagedFiles, ['**/scripts/**/*.mjs']).length > 0

  if (allTesting) {
    commands.push('yarn test all')
  } else {
    const hasLibs = micromatch(allStagedFiles, [
      '**/packages/**/*.{ts,tsx}',
      '!**/docs/**',
      '!**/core/**',
      '!**/utils/**',
    ])

    const result = new Set()
    for (const filePath of hasLibs) {
      const pkgDir = filePath.match(/.*\/packages\/([a-z-]+)\/.+$/)[1]
      result.add(`yarn test ${pkgDir}`)
    }

    commands.push(...result)
  }

  if (hasTsTsx) {
    commands.unshift('yarn lint', 'yarn typecheck')
  }

  if (hasScripts) {
    commands.unshift('yarn lint:scripts')
  }

  if (coreMatch.length > 0) {
    commands.unshift('yarn workspace @rattus-orm/core run build')
  }

  if (utilsMatch.length > 0) {
    commands.unshift('yarn workspace @rattus-orm/utils run build')
  }

  return commands
}
