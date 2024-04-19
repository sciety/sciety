.PHONY: help
help:
	@eval $$(sed -r -n 's/^([a-zA-Z0-9_-]+):.*?## (.*)$$/printf "\\033[36m%-30s\\033[0m %s\\n" "\1" "\2" ;/; ta; b; :a p' $(MAKEFILE_LIST) | sort)

include operations.mk

ifeq (${TARGET},)
TARGET := dev
endif

DOCKER_COMPOSE = docker compose --file docker-compose.yml --file docker-compose.$(TARGET).yml
DATA_VOLUME := $(shell pwd)
IMAGE := sciety/sciety
IMAGE_TAG := local
AWS_DEFAULT_REGION := us-east-1
SHELL := /bin/bash

export IMAGE
export IMAGE_TAG
export AWS_DEFAULT_REGION

.PHONY: backstop* build clean* dev find-* get* git-lfs graphs ingest* install lint* prod replay-events-for-elife-subject-area-policy stop test* update* watch* replace-staging-database-with-snapshot-from-prod

dev: export TARGET = dev
dev: export SCIETY_TEAM_API_BEARER_TOKEN = secret
dev: .env install build
	${DOCKER_COMPOSE} up --abort-on-container-exit --exit-code-from app

# This target is in development and experimental; does not restart on code changes
dev-fast: export TARGET = fast
dev-fast: export SCIETY_TEAM_API_BEARER_TOKEN = secret
dev-fast: .env install build
	${DOCKER_COMPOSE} up --abort-on-container-exit --exit-code-from app

prod: export TARGET = prod
prod: export DISPLAY_LAST_SERVER_STARTUP = false
prod: .env build
	${DOCKER_COMPOSE} up --abort-on-container-exit --exit-code-from app

.env:
	cp .env.example .env

.gcp-ncrc-key.json:
	gcloud iam service-accounts keys create ./.gcp-ncrc-key.json --iam-account ncrc-sheet@sciety.iam.gserviceaccount.com

watch-typescript: node_modules
	npm run watch:typescript

unused-exports: node_modules
	npx ts-unused-exports tsconfig.json --silent

test: export TARGET = dev
test: build
	${DOCKER_COMPOSE} run --rm app npm run test

test-coverage: export TARGET = dev
test-coverage: build
	${DOCKER_COMPOSE} run --rm app npm run test:coverage
	sed -i -e 's/\/app\/src/src/g' coverage/coverage-final.json

jest-test:
	EXPERIMENT_ENABLED="true" JWR_PROGRESS="tree" npx jest ${TEST}

backstop-test: export TARGET = fast
backstop-test: export USE_STUB_ADAPTERS = true
backstop-test: export USE_STUB_LOGIN = true
backstop-test: export DISABLE_COOKIEBOT = true
backstop-test: export COMPOSE_PROJECT_NAME=sciety-test
backstop-test: export DISPLAY_LAST_SERVER_STARTUP = false
backstop-test: export APP_PORT=8081
backstop-test: node_modules clean-db build
	${DOCKER_COMPOSE} up -d
	scripts/wait-for-healthy.sh
	${DOCKER_COMPOSE} exec -T db psql -c "copy events from '/data/backstop.csv' with CSV" sciety user
	npx ts-node backstop_data/construct-backstop-state-via-api
	${DOCKER_COMPOSE} restart app
	scripts/wait-for-healthy.sh
	npx backstop --docker --filter="${SCENARIO}" test
	${DOCKER_COMPOSE} down

exploratory-test-backstop: export TARGET = prod
exploratory-test-backstop: export DISABLE_COOKIEBOT = true
exploratory-test-backstop: node_modules clean-db build
	${DOCKER_COMPOSE} up -d
	scripts/wait-for-healthy.sh
	${DOCKER_COMPOSE} exec -T db psql -c "copy events from '/data/backstop.csv' with CSV" sciety user
	${DOCKER_COMPOSE} restart app
	${DOCKER_COMPOSE} up

backstop-approve: node_modules
	npx backstop approve

build:
	$(DOCKER_COMPOSE) build app

install: node_modules git-lfs

node_modules: export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true
node_modules: export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = true
node_modules: package.json package-lock.json
	npm install
	touch node_modules

git-lfs:
	git lfs install

clean-old:
	rm -rf .eslint .jest .stylelint build node_modules static/style.css static/style.css.map

clean-db: stop

stop:
	$(DOCKER_COMPOSE) down

ingest-evaluations: export TARGET = dev
ingest-evaluations: build
	$(DOCKER_COMPOSE) run --name ingest --rm \
		-e INGESTION_TARGET_APP=http://app \
		-e INGEST_DEBUG=${INGEST_DEBUG} \
		-e INGEST_EXCEPT=${INGEST_EXCEPT} \
		-e INGEST_ONLY=${INGEST_ONLY} \
		-e INGEST_DAYS=${INGEST_DAYS} \
		app \
		npx ts-node src/ingest/update-event-data

dev-sql: export TARGET = dev
dev-sql:
	$(DOCKER_COMPOSE) exec -e PGUSER=user -e PGPASSWORD=secret -e PGDATABASE=sciety db psql

taiko: export TARGET = fast
taiko: export USE_STUB_ADAPTERS = true
taiko: export USE_STUB_LOGIN = true
taiko: export DISPLAY_LAST_SERVER_STARTUP = false
taiko: node_modules clean-db build
	${DOCKER_COMPOSE} up -d
	scripts/wait-for-healthy.sh
	npx jest ${TEST} --testTimeout=300000 --cache-directory=.jest-taiko --roots ./feature-test/
	${DOCKER_COMPOSE} down

exploratory-test-from-prod: node_modules clean-db build
	@if ! [[ -f 'data/exploratory-test-from-prod.csv' ]]; then \
    echo "Ensure you have run: make download-exploratory-test-from-prod"; exit 1; \
	fi
	${DOCKER_COMPOSE} up -d db
	scripts/wait-for-database.sh
	${DOCKER_COMPOSE} exec -T db psql -c "CREATE TABLE IF NOT EXISTS events ( id uuid, type varchar, date timestamp, payload jsonb, PRIMARY KEY (id));" sciety user
	${DOCKER_COMPOSE} exec -T db psql -c "COPY events FROM '/data/exploratory-test-from-prod.csv' WITH CSV HEADER" sciety user
	${DOCKER_COMPOSE} up -d app
	scripts/wait-for-healthy.sh
	${DOCKER_COMPOSE} logs -f app

crossref-response:
	curl -v \
		-H 'Accept: application/vnd.crossref.unixref+xml' \
		-H 'User-Agent: Sciety (https://sciety.org; mailto:team@sciety.org)' \
		'https://api.crossref.org/works/${DOI}/transform'

#------------------------------------------------------------------------------

GRAPH_DIR := ./graphs
MK_LINTED_TS := .mk-linted-ts
MK_TESTED_TS := .mk-tested-ts
MK_LINTED_SASS := .mk-linted-sass
MK_TYPECHECKED_TS := .mk-typechecked-ts
TS_SOURCES := $(shell find src test feature-test -name '*.ts')
SASS_SOURCES := $(shell find src test feature-test -name '*.scss')
LINT_CACHE := .eslint-cache
STYLELINT_CACHE := .stylelint/

check: $(MK_TESTED_TS) $(MK_LINTED_TS) $(MK_LINTED_SASS)

lint: $(MK_LINTED_TS) $(MK_LINTED_SASS)

lint-fix: node_modules
	npx eslint src test feature-test \
		--ext .js,.ts \
		--cache --cache-location $(LINT_CACHE) \
		--color --max-warnings 0 \
		--fix
	npx stylelint 'src/**/*.scss' \
		--cache --cache-location $(STYLELINT_CACHE) \
		--fix

$(MK_LINTED_TS): node_modules $(TS_SOURCES)
	npx eslint src test feature-test \
		--ext .js,.ts \
		--cache --cache-location $(LINT_CACHE) \
		--color --max-warnings 0
	npx madge --circular --extensions ts src test feature-test
	npx ts-unused-exports tsconfig.json --silent
	@touch $@

$(MK_LINTED_SASS): node_modules $(SASS_SOURCES) $(TS_SOURCES)
	npx stylelint 'src/**/*.scss' --cache --cache-location $(STYLELINT_CACHE)
	npx sass-unused 'src/**/*.scss'
	rm -f .purgecss/{full,purged}.css
	npx sass --load-path=src/shared-sass --no-source-map src/html-pages/style.scss:.purgecss/full.css
	npx purgecss --config purgecss.config.js --css .purgecss/full.css --output .purgecss/purged.css
	diff .purgecss/full.css .purgecss/purged.css
	rm -f .purgecss/{full,purged}.css
	@touch $@

typecheck: $(MK_TYPECHECKED_TS)

$(MK_TYPECHECKED_TS): node_modules $(TS_SOURCES)
	npx tsc --noEmit
	@touch $@

$(MK_TESTED_TS): node_modules $(TS_SOURCES)
	EXPERIMENT_ENABLED="true" npx jest --onlyChanged
	@touch $@

graphs:
	$(MAKE) -C $(GRAPH_DIR)

clean: clean-db-dumps
	rm -rf $(MK_LINTED_SASS) $(MK_LINTED_TS) $(MK_TESTED_TS)
	rm -rf $(LINT_CACHE)
	rm -rf $(STYLELINT_CACHE)
	$(MAKE) -C $(GRAPH_DIR) clean

clobber: clean
	rm -rf build node_modules

check-ci: compile-prod check

compile-prod: export TARGET = prod
compile-prod: .env build

helm-dry-run:
	helm install --debug --dry-run --set hostname=example.sciety.org sciety--example ./helm/sciety
