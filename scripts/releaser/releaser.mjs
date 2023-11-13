import {runForPackage} from "./release-package.mjs";
import {getPackages} from "../utils.mjs";

async function main() {
    const forPackages = getPackages(false)

    if (!forPackages.length) {
        console.log('Pass --packages option')
        process.exit()
    }

    for (const packageName of forPackages) {
        await runForPackage(packageName)
    }
}

main()
