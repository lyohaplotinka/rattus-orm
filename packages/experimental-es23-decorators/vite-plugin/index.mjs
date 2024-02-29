import { dirname } from 'node:path';
import { EOL } from 'node:os';
import { createFilter } from 'vite';
import ts from 'typescript';

function createPlugin(options) {
  var _a, _b, _c, _d, _e;
  const cache = /* @__PURE__ */ new Map();
  const filterCode = ((_a = options == null ? void 0 : options.filter) == null ? void 0 : _a.code) ?? (() => true);
  const filterFile = createFilter((_c = (_b = options == null ? void 0 : options.filter) == null ? void 0 : _b.files) == null ? void 0 : _c.include, (_e = (_d = options == null ? void 0 : options.filter) == null ? void 0 : _d.files) == null ? void 0 : _e.exclude);
  return {
    apply: options == null ? void 0 : options.apply,
    enforce: options == null ? void 0 : options.enforce,
    name: "vite-plugin-typescript-transform",
    buildStart() {
      cache.clear();
    },
    transform(code, file) {
      if (!filterFile(file) || !filterCode(code)) {
        return;
      }
      try {
        const compilerOptions = prepareCompilerOptions(cache, file, options);
        const compiler = ts.transpileModule(code, { compilerOptions, fileName: file });
        return {
          code: compiler.outputText,
          map: compiler.sourceMapText
        };
      } catch (error) {
        this.error(formatErrorOrDiagnostic(error));
      }
    }
  };
}
function formatErrorOrDiagnostic(error) {
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error;
  }
  return ts.flattenDiagnosticMessageText(error, EOL);
}
function prepareCompilerOptions(cache, file, options) {
  var _a, _b, _c;
  const key = ((_a = options == null ? void 0 : options.tsconfig) == null ? void 0 : _a.location) ?? dirname(file);
  if (cache.has(key)) {
    return cache.get(key);
  }
  const location = ((_b = options == null ? void 0 : options.tsconfig) == null ? void 0 : _b.location) ?? ts.findConfigFile(file, ts.sys.fileExists);
  if (location) {
    const { config, error } = ts.readConfigFile(location, ts.sys.readFile);
    if (error) {
      throw error;
    }
    const configLocation = dirname(location);
    const { options: tsconfigOptions } = ts.parseJsonConfigFileContent(config, ts.sys, configLocation);
    const compilerOptions = {
      ...tsconfigOptions,
      ...(_c = options == null ? void 0 : options.tsconfig) == null ? void 0 : _c.override,
      pathsBasePath: "/Users/alexeysolovyov/CODE/GitHub/rattus-orm/attempt-3/packages/experimental-es23-decorators/src"
    };
    cache.set(key, compilerOptions);
    return compilerOptions;
  }
  throw new Error(`Could not find TypeScript configuration for ${file}`);
}

export { createPlugin as vitePluginTypescriptTransform };
