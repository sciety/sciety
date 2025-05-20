Sciety
======

The repo for [sciety.org].

Developed and maintained by Sciety's remote first [ensemble programming] team.

Development
-----------

<details>

<summary>Requirements</summary>

- [Docker]
- [Docker Compose]
- [GNU Make]
- [Node.js]
- [Git LFS]
- [coreutils] (for the `timeout` command)
- Unix-like operating system

</details>

### Running the app

To build and run the app for development, execute:

```shell
make dev
```

You can now access the app at <http://localhost:8080>.

Certain parts of the application require you to have set up credentials for external services on your machine.

Most content will be missing as the database will be empty, see the Operations section below on how to populate it.

Containers restart automatically on most code changes. If they don't, `ctrl-c` and rerun `make dev`. An example of when this is needed, is changes to `package.json`.

#### Configuring environment variables and credentials

Environment variables control certain behaviour.

For the application to be able to interact with external services, credentials need to be provided via the `.env` file as well as dedicated credential files.

Before running `make dev` you have to create a `.env` file based on `.env.example`. This includes instructions on how to populate and use it.

You'll need to re-run `make dev` after modifying the `.env` file.

Use [the GCP console](https://console.cloud.google.com/iam-admin/serviceaccounts/details/104048143259449897526/keys?project=sciety) to create a GCP key. This is used to access NCRC evaluations and needs to be stored in a file named `.gcp-ncrc-key.json`.

### Running the tests

#### Fast tests

These tests live in `test/` and use [Jest]. You can run them by executing:

```shell
make test
```

#### Slow tests

Browser-based tests live in `feature-test/` and use Taiko or Axios. We use them for user journeys or API calls.

```shell
make feature-test
```

To run just one test file, execute:

```shell
make feature-test TEST=[file-name].ts
```

Visual regression tests are defined in `backstop.json`. They rely on approved screenshots in `backstop_data/` stored with Git LFS.

```shell
make backstop-test
make backstop-approve
```

If you want to only run a subset of scenarios, execute:

```shell
make backstop-test SCENARIO=article
make backstop-test SCENARIO="header|footer"
```

### Linting

The following target runs all static code checks:

```shell
make check
```

You can fix problems, where possible, by executing:

```shell
make lint-fix
```

The above is quite heavy weight and can take a while.
To increase feedback speed you can gain partial coverage:

```shell
make watch-typescript
```
To temporarily ignore unused exports:
```
// ts-unused-exports:disable-next-line
export const iAmUnused = true;
```

In our team we also rely on eslint feedback from our IDEs.

To check only for unused TypeScript exports, execute:
```shell
make unused-exports
```

## Operations

The application is deployed on a Kubernetes cluster via an Helm chart.

A [staging environment] and [production environment] are updated with every new commit on `main` that passes CI.

There is a `#sciety-errors` Slack channel.

View logs, k8s metrics and create dashboard on [sciety.grafana.net](https://sciety.grafana.net).

### Looking at logs

Logs from all kubernetes pods from the last 30 days are viewable on Grafana Cloud.

Authentication is based on elifesciences Google account.

Example queries:

- [production-error-logs]
- [production-ingress-logs]

### Looking at the cache

Create a container from which you can connect to the production cache:
```
make connect-to-cache
```

From there, start the redis CLI with:
```
redis-cli -h sciety--prod--cache
```

List the keys with:
```
KEYS *
```

### Local exploratory testing with copy of production DB

#### Requirements

- [kubectl]
- [aws-cli]
- [aws credentials]
- [kubeconfig setup]: to run any makefile targets that interact with staging or production.

#### Commands to get and run copy of production DB

```shell
make download-exploratory-test-from-prod
make exploratory-test-from-prod
```

#### Calling APIs locally

To test locally, set content header `Authorization: Bearer secret`.

### Calling staging and production APIs

#### Adding an article to a group list

- define beforehand the authorization variable
  ` export SCIETY_TEAM_API_BEARER_TOKEN=the-secret-token-from-dotenv-or-1password`
- adjust `expressionDoi` and `listId` as needed

```sh
curl -v -H "Authorization: Bearer $SCIETY_TEAM_API_BEARER_TOKEN" -X POST https://sciety.org/api/add-article-to-list -H "Content-type: application/json" -d '{"expressionDoi": "10.21203/rs.3.rs-955726/v1", "listId": "5ac3a439-e5c6-4b15-b109-92928a740812"}'
```

#### Adding a group

Prior to adding a group three files need to be made available:
- square avatar [Group static files](https://github.com/sciety/group-static-files)
- large logo [Sciety repo](/static/groups/large-logos/)
- group description [Sciety repo](/static/groups/)

Aim for a large horizontal logo of 600px width. Refer to the [group page sass](src/html-pages/group-page/common-components/_index.scss).

```sh
curl -v -H "Authorization: Bearer ${SCIETY_TEAM_API_BEARER_TOKEN}" \
	-X POST https://staging.sciety.org/api/add-group \
	-H "Content-type: application/json" \
	-d '{"groupId": "cc4c8e79-402f-40e7-80fd-1062145d24ec", "avatarPath": "https://raw.githubusercontent.com/sciety/group-static-files/main/metaror.png", "descriptionPath": "metaror.md", "homepage": "https://metaror.org/", "name": "MetaROR", "shortDescription": "MetaROR is a collaborative initiative led jointly by the Research on Research Institute (RoRI) and the Association for Interdisciplinary Meta-Research and Open Science (AIMOS), which are working together to build a platform to leverage the strengths of the Publish – Review – Curate approach for the various metaresearch disciplines.", "slug": "metaror", "largeLogoPath": "/static/groups/large-logos/metaror.png"}'
```

License
-------

We released this software under the [MIT license][License]. Copyright © 2020 [eLife Sciences Publications, Ltd][eLife].

[Architecture sketch]: https://miro.com/app/board/o9J_ksK0wlg=/
[aws-cli]: https://aws.amazon.com/cli/
[Docker]: https://www.docker.com/
[Docker Compose]: https://docs.docker.com/compose/
[eLife]: https://elifesciences.org/
[ensemble programming]: https://en.wikipedia.org/w/index.php?title=Ensemble_programming&redirect=no
[ESLint]: https://eslint.org/
[Git LFS]: https://git-lfs.github.com/
[GNU Make]: https://www.gnu.org/software/make/
[Jest]: https://jestjs.io/
[kubectl]: https://kubernetes.io/docs/tasks/tools/
[License]: LICENSE.md
[Makefile]: Makefile
[Monitoring SNS topic]: https://console.aws.amazon.com/sns/v3/home?region=us-east-1#/topic/arn:aws:sns:us-east-1:540790251273:prc-logging
[Monitoring lambda]: https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/notifySlackFromSnsTopicError
[Node.js]: https://nodejs.org/
[Production environment]: https://sciety.org
[production-error-logs]: https://sciety.grafana.net/explore?orgId=1&left=%7B%22datasource%22:%22grafanacloud-sciety-logs%22,%22queries%22:%5B%7B%22expr%22:%22%7Bapp_kubernetes_io_name%3D%5C%22sciety%5C%22,app_kubernetes_io_instance%3D%5C%22sciety--prod%5C%22%7D%5Cn%7C%20json%20%7C%20__error__%3D%5C%22%5C%22%5Cn%7C%20level%20%3D%20%5C%22error%5C%22%22,%22refId%22:%22A%22%7D%5D,%22range%22:%7B%22from%22:%22now-2d%22,%22to%22:%22now%22%7D%7D
[production-ingress-logs]: https://sciety.grafana.net/explore?orgId=1&left=%7B%22datasource%22:%22grafanacloud-sciety-logs%22,%22queries%22:%5B%7B%22refId%22:%22B%22,%22expr%22:%22%7Bapp_kubernetes_io_name%3D%5C%22ingress-nginx%5C%22%7D%5Cn%7C%20json%5Cn%7C%20__error__%3D%5C%22%5C%22%5Cn%7C%20ingress_name%3D%5C%22sciety--prod--frontend%5C%22%22%7D%5D,%22range%22:%7B%22from%22:%22now-2d%22,%22to%22:%22now%22%7D%7D
[Staging environment]: https://staging.sciety.org
[sciety.org]: https://sciety.org
[aws credentials]: https://github.com/sciety/infrastructure/blob/main/README.md#aws-access
[kubeconfig setup]: https://github.com/sciety/infrastructure/blob/main/README.md#kubectl-access
[coreutils]: https://www.gnu.org/software/coreutils/

