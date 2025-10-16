@radham/duo-build
=================

An opinionated CLI build app that produces both CJS and ESM based on esbuild.

Install
-------

...

Usage
-----

```sh-session
$ duo-build --help

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
```

License
-------

The BSD 3-Clause License. See the [license file](LICENSE) for details.
