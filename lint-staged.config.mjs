import micromatch from 'micromatch'

export default (allStagedFiles) => {
  const commands = []

  const coreMatch = micromatch(allStagedFiles, ['**/core/**/*.{ts,tsx}'])
  const hasTsTsx = micromatch(allStagedFiles, ['**/*.{ts,tsx}']).length > 0
  const hasScripts = micromatch(allStagedFiles, ['**/scripts/**/*.{ts,tsx,js,mjs}']).length > 0

  if (hasTsTsx) {
    commands.unshift('yarn lint', 'yarn typecheck')
  }

  if (hasScripts) {
    commands.unshift('yarn lint:scripts')
  }

  if (coreMatch.length > 0) {
    commands.unshift('yarn workspace @rattus-orm/core run build')
  }

  return commands
}
