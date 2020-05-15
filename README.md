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
   1. [Architecture Decision Records](./.adr)
1. [Operations](#operations)
   1. [Releasing to production](#releasing-to-production)
   1. [Looking at logs](#looking-at-logs)
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

## Operations

The application is deployed on a Kubernetes cluster via an Helm chart.

A [staging environment] is updated with every new commit on `master` that passes tests.

A [production environment] is [updated][production deployments] manually by pushing a tag.

### Releasing to production

```
TAG=latest/$(date +%Y%m%d%H%M)
git tag $TAG && git push origin $TAG
```

### Looking at logs

Logs of all Pods are streamed to [AWS CloudWatch][AWS CloudWatch logs] for persistence and searchability.

License
-------

We released this software under the [MIT license][license]. Copyright © 2020 [eLife Sciences Publications, Ltd][eLife].

[AWS CloudWatch logs]: https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logs-insights:queryDetail=~(end~0~start~-900~timeType~'RELATIVE~unit~'seconds~editorString~'fields*20*40timestamp*2c*20*40message*0a*7c*20filter*20*60kubernetes.labels.app_kubernetes_io*2finstance*60*3d*22prc--prod*22*0a*7c*20sort*20*40timestamp*20desc*0a*7c*20limit*2020~isLiveTail~false~queryId~'89133ab9-5bb4-4770-b3e9-96052e8300ef~source~(~'*2faws*2fcontainerinsights*2flibero-eks--franklin*2fapplication));tab=logs
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
[Makefile]: Makefile
[Node.js]: https://nodejs.org/
[Open issues]: https://github.com/libero/prc/issues?q=is%3Aissue+is%3Aopen
[Open issues badge]: https://flat.badgen.net/github/open-issues/libero/prc?icon=github&color=pink
[Production deployments]: https://github.com/libero/prc/actions?query=workflow%3AProduction
[Production environment]: http://prc.libero.pub
[Staging environment]: http://prc-staging.libero.pub
[TypeScript]: https://www.typescriptlang.org/
