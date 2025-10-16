#!/usr/bin/env node

import duoBuild from './index.js';
import esbuild from 'esbuild';
import meow from 'meow';

const cli = meow(`
  An opinionated CLI build app that produces both CJS and ESM based on esbuild.

  Usage
    $ duo-build

  Options
    --external, -e  Mark a file or a package as external to exclude it from the build.
                    Can be specified multiple times.
    --help, -h      Display this message.
    --platform, -p  The platform to build for ("browser", "neutral", or "node").
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
    platform: {
      choices: ['browser', 'neutral', 'node'],
      default: 'browser',
      type: 'string',
      shortFlag: 'p'
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
    platform: cli.flags.platform as esbuild.Platform
  };

  await duoBuild(options);
} catch (error) {
  console.error(error);
  process.exit(1);
}
