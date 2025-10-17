import esbuild from 'esbuild';
import type { BuildOptions } from 'esbuild';
import { $ } from 'execa';
import isPlainObject from 'is-plain-obj';
import fs from 'node:fs/promises';
import path from 'node:path';
import sortPackageJson from 'sort-package-json';

const COMMON_ESBUILD_OPTIONS = {
  bundle: true,
  entryPoints: ['src/index.ts'],
  minify: true,
  sourcemap: true
};
const CJS_PATH = 'dist/cjs';
const ESM_PATH = 'dist/esm';

async function isFile(filepath: string): Promise<boolean> {
  try {
    return (await fs.stat(filepath)).isFile();
  } catch (_) {
    return false;
  }
}

async function readPackageJson() {
  const buffer = await fs.readFile('package.json');
  const source = buffer.toString();

  return JSON.parse(source);
}

async function writePackageJson(type: 'commonjs' | 'module'): Promise<void> {
  const basePath = type === 'commonjs' ? CJS_PATH : ESM_PATH;
  const packageJson = await readPackageJson();
  const ensureDotForwardSlashPrefix = (value: string) =>
    value.startsWith('./') ? value : `./${value}`;

  if (
    isPlainObject(packageJson.exports) &&
    isPlainObject(packageJson.exports.import) &&
    isPlainObject(packageJson.exports.require)
  ) {
    // The `exports` property now has incorrect paths, so we fix this according to the module type.
    packageJson.types = path.posix.relative(basePath, packageJson.exports.import.types);
    packageJson.exports = ensureDotForwardSlashPrefix(
      type === 'commonjs'
        ? path.posix.relative(basePath, packageJson.exports.require.default)
        : path.posix.relative(basePath, packageJson.exports.import.default)
    );
  } else {
    console.warn(
      'The `exports` property in the `package.json` is either undefined, not an object,' +
      ' or not of the expected object structure.'
    );
  }

  if (type === 'module') {
    // If we're writing the ESM package.json, then the bin file paths are wrong. I don't think it
    // really matters, but we fix it here just in case.
    if (typeof packageJson.bin === 'string') {
      packageJson.bin = path.posix.relative(basePath, packageJson.bin);
    } else {
      Object.entries(packageJson.bin ?? {}).forEach(([key, value]) => {
        packageJson.bin[key] = path.posix.relative(basePath, value as string);
      });
    }
  } else {
    // If we're writing the CJS package.json, then the bin file paths are invalid. Because we always
    // run our CLI apps via ESM.
    delete packageJson.bin;
  }

  // Some package properties are invalid, problematic, or complex to fix in this new context. So we
  // just delete them outright.
  delete packageJson.dependencies;
  delete packageJson.devDependencies;
  delete packageJson.files;
  delete packageJson.peerDependencies;
  delete packageJson.scripts;

  const filepath = `${basePath}/package.json`;
  const data = JSON.stringify({ ...packageJson, type }, null, 2);

  await fs.writeFile(filepath, sortPackageJson(data));
}

async function buildCjs(options: BuildOptions = {}): Promise<void> {
  const defaultOptions = { ...COMMON_ESBUILD_OPTIONS, format: 'cjs' as const, outdir: CJS_PATH };

  await esbuild.build({ ...defaultOptions, ...options });
  await writePackageJson('commonjs');
}

async function buildEsm(options: BuildOptions = {}): Promise<void> {
  const isCliApp = await isFile('src/cli.ts');
  const entryPoints = isCliApp
    ? [...COMMON_ESBUILD_OPTIONS.entryPoints, 'src/cli.ts']
    : COMMON_ESBUILD_OPTIONS.entryPoints;
  const defaultOptions = {
    ...COMMON_ESBUILD_OPTIONS,
    entryPoints,
    format: 'esm' as const,
    outdir: ESM_PATH
  };

  await esbuild.build({ ...defaultOptions, ...options });
  await writePackageJson('module');
}

async function buildTypes(): Promise<void> {
  await $`tsc`;
}

export default async function duoBuild(options: BuildOptions = {}): Promise<void> {
  await Promise.all([buildCjs(options), buildEsm(options), buildTypes()]);
}
