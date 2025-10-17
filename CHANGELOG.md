Changelog
=========

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

[Unreleased]
------------

### Changed

- Normalized the app to use POSIX paths. Some things like `package.bin` can apparently break if
  using Windows paths.
- The contents of the root `package.json` are now copied into the respective
  `dist/{cjs,esm}/package.json` files before being potentially modified. The mostly empty
  `package.json` files which were being created before were causing issues with apps which utilized
  the `meow` package (_e.g._, the `version` property was missing so the `--version` flag was
  broken).

[0.1.1] - 2025-10-17
--------------------

### Fixed

- Broken link in changelog.

[0.1.0] - 2025-10-17
--------------------

### Added

- Initial release.

[Unreleased]: https://github.com/jbenner-radham/node-duo-build/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/jbenner-radham/node-duo-build/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/jbenner-radham/node-duo-build/releases/tag/v0.1.0
