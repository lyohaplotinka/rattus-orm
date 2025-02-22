import { merge } from 'lodash-es'
import type { Options } from 'tsup'
import { defineConfig } from 'tsup'

export default function createTsupConfig(
  entries: Record<string, string>,
  mixinOptions: Partial<Options> = {},
) {
  const configBase: Options = {
    entry: entries,
    format: ['esm', 'cjs'],
    clean: true,
    splitting: false,
    minify: false,
    dts: {
      entry: entries,
    },
    skipNodeModulesBundle: true,
    external: ['vue', 'vuex', '@rattus-orm/core', '@vue/reactivity', 'vitest'],
  }

  const merged = merge(configBase, mixinOptions)
  return defineConfig(merged)
}
