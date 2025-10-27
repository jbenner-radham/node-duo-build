#!/usr/bin/env node

import duoBuild from './index.js';
import type { Platform } from 'esbuild';
import meow from 'meow';
import { getHelpTextAndOptions } from 'meowtastic';

const cli = meow(...getHelpTextAndOptions({
  flags: {
    external: {
      description: 'Mark a file or a package as external to exclude it from the build. Can be' +
        ' specified multiple times.',
      isMultiple: true,
      type: 'string',
      shortFlag: 'e'
    },
    packages: {
      choices: ['bundle', 'external'],
      description: 'Whether package dependencies are bundled with or excluded from the build. Can' +
        ' be set to %CHOICES_OR%. Defaults to %DEFAULT%.',
      default: 'bundle',
      type: 'string',
      shortFlag: 'p'
    },
    platform: {
      choices: ['browser', 'neutral', 'node'],
      description: 'The platform to build for (%CHOICES_OR%). Defaults to %DEFAULT%.',
      default: 'browser',
      type: 'string',
      shortFlag: 'P'
    }
  },
  importMeta: import.meta
}));

try {
  const options = {
    external: cli.flags.external as string[],
    packages: cli.flags.packages as 'bundle' | 'external',
    platform: cli.flags.platform as Platform
  };

  await duoBuild(options);
} catch (error) {
  console.error(error);
  process.exit(1);
}
