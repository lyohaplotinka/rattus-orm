import type { Options } from 'tsup'
import { defineConfig } from 'tsup'

export default function createTsupConfig(entries: Record<string, string>, mixinOptions: Partial<Options> = {}) {
  return defineConfig({
    entry: entries,
    format: ['esm', 'cjs'],
    clean: true,
    splitting: false,
    minify: false,
    dts: {
      entry: entries,
    },
    ...mixinOptions,
  })
}
