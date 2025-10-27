duo-build
=========

An opinionated build tool that produces both [CJS](https://nodejs.org/api/modules.html) and
[ESM](https://nodejs.org/api/esm.html) powered by [esbuild](https://esbuild.github.io/).

Since `duo-build` is opinionated, it makes the following assumptions about your project:

- It is [TypeScript](https://www.typescriptlang.org/) based.
- Its entrypoint is `src/index.ts`.
- If it is a CLI app it will have a `src/cli.ts` script which will act as an additional entrypoint
  (for ESM only).
- Build artifacts are placed in `dist`. Which has `cjs`, `esm`, and `types` subdirectories.
- The `tsconfig.json` will specify the `"declaration": true`, `"emitDeclarationOnly": true`, and
  `"outDir": "./dist/types"` compiler options.

Install
-------

As a development dependency:

```shell
npm install --save-dev duo-build
```

Or use without installing:

```shell
npx duo-build
```

Usage
-----

```sh-session
$ duo-build --help

  An opinionated build tool that produces both CJS and ESM powered by esbuild.

  Usage
    $ duo-build [OPTIONS]

  Options
    --external, -e  Mark a file or a package as external to exclude it from the
                    build. Can be specified multiple times.
    --help, -h      Display this message.
    --packages, -p  Whether package dependencies are bundled with or excluded from
                    the build. Can be set to "bundle", or "external". Defaults to
                    "bundle".
    --platform, -P  The platform to build for ("browser", "neutral", or "node").
                    Defaults to "browser".
    --version, -v   Display the application version.
```

License
-------

The BSD 3-Clause License. See the [license file](LICENSE) for details.
