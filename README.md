[![Libero][Libero logo]][Libero]  

PRC
===

[![Build status][Build badge]][Build]
[![Open issues][Open issues badge]][Open issues]
[![License][License badge]][License]

⚠️ This app only serves static HTML.

It's written in [TypeScript], and uses the [Koa framework][Koa].

Table of contents
-----------------

1. [Development](#development)
   1. [Running the app](#running-the-app)
   1. [Running the tests](#running-the-tests)
   1. [Linting](#linting)
1. [License](#license)

Development
-----------

<details>

<summary>Requirements</summary>

- [Docker]
- [GNU Make]
- [Node.js]

</details>

The project contains a [Makefile] which uses [Docker] for development.

### Running the app

To build and run the app for development, execute:

```shell
cd frontend
make dev
```

You can now access the app at <http://localhost:8080>.

<details>

<summary>Rebuilding the container</summary>

Static content is attached to the containers as volumes so most updates are visible without a need to rebuild the
container. However, changes to NPM dependencies, for example, require a rebuild. So you may need to execute

```shell
make dev
```

again before running further commands.

</details>

### Running the tests

We use [Jest] to test the app. You can run it by executing: 

```shell
make test
```

### Linting

We lint the app with [ESLint]. You can run it by:

```shell
make lint
```

You can fix problems, where possible, by executing:

```shell
make lint:fix
```

License
-------

We released this software under the [MIT license][license]. Copyright © 2020 [eLife Sciences Publications, Ltd][eLife].

[Build]: https://github.com/libero/prc/actions?query=branch%3Amaster+workflow%3ACI
[Build badge]: https://flat.badgen.net/github/checks/libero/prc?label=build&icon=github
[Docker]: https://www.docker.com/
[eLife]: https://elifesciences.org/
[ESLint]: https://eslint.org/
[GNU Make]: https://www.gnu.org/software/make/
[Jest]: https://jestjs.io/
[Koa]: https://koajs.com/
[Libero]: https://libero.pub/
[Libero logo]: https://cdn.elifesciences.org/libero/logo/libero-logo-96px.svg
[License]: LICENSE.md
[License badge]: https://flat.badgen.net/badge/license/MIT/blue
[Makefile]: frontend/Makefile
[Node.js]: https://nodejs.org/
[Open issues]: https://github.com/libero/prc/issues?q=is%3Aissue+is%3Aopen
[Open issues badge]: https://flat.badgen.net/github/open-issues/libero/prc?icon=github&color=pink
[TypeScript]: https://www.typescriptlang.org/
