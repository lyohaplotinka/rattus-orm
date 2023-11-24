import { runForPackage } from "./release-package.mjs";
import { parsePackages } from "../utils.mjs";
import { program } from "commander";

program
  .name('releaser.mjs')
  .description('Release script for Rattus ORM')
  .version('0.0.1')

program.command('release')
  .description('Release a new version to NPM and GitHub')
  .argument('<packages>', 'packages to release, comma-separated')
  .action(async (packages) => {
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
