#!/usr/bin/env node

import duoBuild from './index.js';
import type { Platform } from 'esbuild';
import meow from 'meow';

const cli = meow(`
  Usage
    $ duo-build

  Options
    --external, -e  Mark a file or a package as external to exclude it from the build.
                    Can be specified multiple times.
    --help, -h      Display this message.
    --packages, -p  Whether package dependencies are bundled with or excluded from the build.
                    Can be set to "bundle" or "external". Defaults to "bundle".
    --platform, -P  The platform to build for ("browser", "neutral", or "node").
                    Defaults to "browser".
    --version, -v   Display the application version.
`, {
  importMeta: import.meta,
  flags: {
    external: {
      isMultiple: true,
      type: 'string',
      shortFlag: 'e'
    },
    help: {
      type: 'boolean',
      shortFlag: 'h'
    },
    packages: {
      choices: ['bundle', 'external'],
      default: 'bundle',
      type: 'string',
      shortFlag: 'p'
    },
    platform: {
      choices: ['browser', 'neutral', 'node'],
      default: 'browser',
      type: 'string',
      shortFlag: 'P'
    },
    version: {
      type: 'boolean',
      shortFlag: 'v'
    }
  }
});

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
