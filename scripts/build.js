import esbuild from 'esbuild';
import { $ } from 'execa';
import fs from 'node:fs/promises';
import path from 'node:path';

const cjsPath = path.join('dist', 'cjs');
const entryPoints = [path.join('src', 'index.ts')];
const esmPath = path.join('dist', 'esm');
const commonBuildOptions = { bundle: true, entryPoints, minify: true, sourcemap: true };

async function buildCjs() {
  await esbuild.build({ ...commonBuildOptions, format: 'cjs', outdir: cjsPath });

  const cjsPackageJson = JSON.stringify({ type: 'commonjs' }, null, 2);

  await fs.writeFile(path.join(cjsPath, 'package.json'), cjsPackageJson);
}

async function buildEsm() {
  await esbuild.build({ ...commonBuildOptions, format: 'esm', outdir: esmPath });

  const esmPackageJson = JSON.stringify({ type: 'module' }, null, 2);

  await fs.writeFile(path.join(esmPath, 'package.json'), esmPackageJson);
}

async function buildTypes() {
  await $`tsc`;
}

await Promise.all([buildCjs(), buildEsm(), buildTypes()]);
