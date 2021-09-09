Sciety
======

[![Commit checks][Checks badge]][Checks]
[![Open issues][Open issues badge]][Open issues]
[![License][License badge]][License]

Table of contents
-----------------

1. [Development](#development)
   1. [Running the app](#running-the-app)
   1. [Running the tests](#running-the-tests)
   1. [Linting](#linting)
   1. [Architecture Decision Records](./.adr)
   1. [Architecture sketch]
1. [Operations](#operations)
   1. [Releasing to production](#releasing-to-production)
   1. [Looking at logs](#looking-at-logs)
   1. [Updating event data](#updating-event-data)
   1. [Dump all data to a CSV](#dump-all-data)
1. [License](#license)

Development
-----------

<details>

<summary>Requirements</summary>

- [Docker]
- [Docker Compose]
- [GNU Make]
- [Node.js]
- [Git LFS]
- [logcli]

</details>

The project contains a [Makefile] which uses [Docker] and [Docker Compose] for development.

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

<details>

<summary>Configuring environment variables</summary>

You can use a `.env` file to pass environment variables to the container.

After running `make dev` the file will contain a set of instructions to follow.

Re-run `make dev` after modifying this file.

</details>

### Running the tests

We use [Jest] to test the app. You can run it by executing: 

```shell
make test
```

To run all the regression tests, execute:

```shell
make taiko
```

To run just one regression test file, execute:

```shell
make taiko TEST=[file-name].ts
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

A [staging environment] is updated with every new commit on `main` that passes tests.

A [production environment] is [updated][production deployments] manually by pushing a tag.

### Releasing to production

Ensure your current reference is [green in CI][build].

Run `make release`.

### Looking at logs

Logs of all Pods are streamed to [AWS CloudWatch][AWS CloudWatch logs] for persistence and searchability.

A [CloudWatch dashboard] graphs log lines representing errors and shows the state of the alarm.

An [monitoring SNS topic] triggers a [lambda function that notifies the Slack #sciety-general channel][monitoring
 lambda].

A [CloudWatch user journey by IP] query is available to track a single client across multiple requests (adjust timeframe and IP).

### Updating event data

Run `make -j 4 update-event-data`.

Substitute `4` with the desired concurrency level.


### Dump all data

Run `make prod-sql`.

At the prompt, execute this command:

```sql
\copy (SELECT date, type, payload FROM events ORDER BY date) TO STDOUT WITH CSV;
```

License
-------

We released this software under the [MIT license][license]. Copyright © 2020 [eLife Sciences Publications, Ltd][eLife].

[Architecture sketch]: https://miro.com/app/board/o9J_ksK0wlg=/
[AWS CloudWatch logs]: https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logs-insights:queryDetail=~(end~0~start~-900~timeType~'RELATIVE~unit~'seconds~editorString~'fields*20*40timestamp*2c*20*40message*0a*7c*20filter*20*60kubernetes.labels.app_kubernetes_io*2finstance*60*3d*22prc--prod*22*0a*7c*20sort*20*40timestamp*20desc*0a*7c*20limit*2020~isLiveTail~false~queryId~'89133ab9-5bb4-4770-b3e9-96052e8300ef~source~(~'*2faws*2fcontainerinsights*2flibero-eks--franklin*2fapplication));tab=logs
[Build]: https://github.com/sciety/sciety/actions?query=workflow%3ACI
[Checks]: https://github.com/sciety/sciety/actions
[Checks badge]: https://flat.badgen.net/github/checks/sciety/sciety/main?icon=github
[CloudWatch dashboard]: https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=PRCMetrics
[CloudWatch user journey by IP]: https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:logs-insights$3FqueryDetail$3D$257E$2528end$257E0$257Estart$257E-1800$257EtimeType$257E$2527RELATIVE$257Eunit$257E$2527seconds$257EeditorString$257E$2527fields*20*40timestamp*2c*20app_request*0a*7c*20filter*20*60kubernetes.labels.app_kubernetes_io*2finstance*60*20*3d*3d*20*27ingress-nginx*27*20and*20app_remote_addr*20*3d*3d*20*2778.105.99.80*27*20and*20app_request*20not*20like*20*2fstatic*2f*0a*7c*20filter*20app_ingress_name*20*3d*3d*20*27sciety--prod--frontend*27*0a*7c*20sort*20*40timestamp*20asc*0a*7c*20limit*20200$257EisLiveTail$257Efalse$257EqueryId$257E$2527e3086054-9d14-4384-bca5-a9c12b181c87$257Esource$257E$2528$257E$2527*2faws*2fcontainerinsights*2flibero-eks--franklin*2fapplication$2529$2529
[Docker]: https://www.docker.com/
[Docker Compose]: https://docs.docker.com/compose/
[eLife]: https://elifesciences.org/
[ESLint]: https://eslint.org/
[Git LFS]: https://git-lfs.github.com/
[GNU Make]: https://www.gnu.org/software/make/
[Jest]: https://jestjs.io/
[License]: LICENSE.md
[License badge]: https://flat.badgen.net/badge/license/MIT/blue
[Makefile]: Makefile
[Monitoring SNS topic]: https://console.aws.amazon.com/sns/v3/home?region=us-east-1#/topic/arn:aws:sns:us-east-1:540790251273:prc-logging
[Monitoring lambda]: https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/notifySlackFromSnsTopicError
[Node.js]: https://nodejs.org/
[Open issues]: https://github.com/sciety/sciety/issues?q=is%3Aissue+is%3Aopen
[Open issues badge]: https://flat.badgen.net/github/open-issues/sciety/sciety?icon=github&color=pink
[Production deployments]: https://github.com/sciety/sciety/actions?query=workflow%3AProduction
[Production environment]: https://sciety.org
[Staging environment]: https://staging.sciety.org
[logcli]: https://github.com/grafana/loki/releases
