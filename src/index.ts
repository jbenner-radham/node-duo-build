import esbuild from 'esbuild';
import { $ } from 'execa';
import fs from 'node:fs/promises';
import path from 'node:path';

const COMMON_ESBUILD_OPTIONS = {
  bundle: true,
  entryPoints: [path.join('src', 'index.ts')],
  minify: true,
  sourcemap: true
};
const CJS_PATH = path.join('dist', 'cjs');
const ESM_PATH = path.join('dist', 'esm');

async function isFile(filepath: string): Promise<boolean> {
  try {
    return (await fs.stat(filepath)).isFile();
  } catch (_) {
    return false;
  }
}

async function writePackageJsonFile(type: 'commonjs' | 'module'): Promise<void> {
  const packageJson = JSON.stringify({ type }, null, 2);
  const filepath = path.join(type === 'commonjs' ? CJS_PATH : ESM_PATH, 'package.json');

  await fs.writeFile(filepath, packageJson);
}

async function buildCjs(options: esbuild.BuildOptions = {}): Promise<void> {
  const defaultOptions = { ...COMMON_ESBUILD_OPTIONS, format: 'cjs' as const, outdir: CJS_PATH };

  await esbuild.build({ ...defaultOptions, ...options });
  await writePackageJsonFile('commonjs');
}

async function buildEsm(options: esbuild.BuildOptions = {}): Promise<void> {
  const cliScriptPath = path.join('src', 'cli.ts');
  const isCliApp = await isFile(cliScriptPath);
  const entryPoints = isCliApp
    ? [...COMMON_ESBUILD_OPTIONS.entryPoints, cliScriptPath]
    : COMMON_ESBUILD_OPTIONS.entryPoints;
  const defaultOptions = {
    ...COMMON_ESBUILD_OPTIONS,
    entryPoints,
    format: 'esm' as const,
    outdir: ESM_PATH
  };

  await esbuild.build({ ...defaultOptions, ...options });
  await writePackageJsonFile('module');
}

async function buildTypes(): Promise<void> {
  await $`tsc`;
}

export default async function duoBuild(options: esbuild.BuildOptions = {}): Promise<void> {
  await Promise.all([buildCjs(options), buildEsm(options), buildTypes()]);
}
