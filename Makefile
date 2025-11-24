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

.PHONY: backstop* build clean* dev feature-test find-* get* git-lfs graphs ingest* install lint* prod* replay-events-for-elife-subject-area-policy stop test* update* unused-exports watch* staging* replace-staging-database-with-snapshot-from-prod exploratory-test-from-* verify-flux-prod-cluster download-exploratory-test-from-prod download-exploratory-test-from-staging switch-to-flux-prod-cluster crossref-response check* compile* typecheck clobber connect* helm-dry-run

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

stub: export USE_STUB_ADAPTERS=true
stub: dev

.env:
	test -f .env

watch-typescript: node_modules
	npm run watch:typescript

unused-exports: node_modules
	npx ts-unused-exports tsconfig.json --silent

test: node_modules
	npx jest --colors

watch: node_modules
	npx jest --watch ${TEST}

test-coverage: export TARGET = dev
test-coverage: build
	${DOCKER_COMPOSE} run --rm app npm run test:coverage
	sed -i -e 's/\/app\/src/src/g' coverage/coverage-final.json

jest-test:
	EXPERIMENT_ENABLED="true" JWR_PROGRESS="tree" npx jest ${TEST}

backstop-test: export TARGET = fast
backstop-test: export USE_STUB_ADAPTERS = true
backstop-test: export USE_STUB_AVATARS = true
backstop-test: export USE_STUB_LOGIN = true
backstop-test: export DISABLE_SAGAS = true
backstop-test: export DISABLE_COOKIEBOT = true
backstop-test: export COMPOSE_PROJECT_NAME=sciety-test
backstop-test: export DISPLAY_LAST_SERVER_STARTUP = false
backstop-test: export APP_PORT=8081
backstop-test: node_modules clean-db build
	@if [ "${GITHUB_ACTIONS}" = "true" ]; then perl -pi -e 's/--user .+? --/--/g' backstop.json; fi
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
	npm clean-install
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
	@echo "Try SELECT * FROM events LIMIT 10; to see the most recent events recorded";
	$(DOCKER_COMPOSE) exec -e PGUSER=user -e PGPASSWORD=secret -e PGDATABASE=sciety db psql

staging-sql: verify-flux-prod-cluster
	kubectl run psql \
	--rm -it --image=postgres:12.3 \
	--env=PGHOST=$$(kubectl get configmap sciety--staging--public-env-vars -o json | jq -r '.data.PGHOST') \
	--env=PGDATABASE=$$(kubectl get configmap sciety--staging--public-env-vars -o json | jq -r '.data.PGDATABASE') \
	--env=PGUSER=$$(kubectl get configmap sciety--staging--public-env-vars -o json | jq -r '.data.PGUSER') \
	--env=PGPASSWORD=$$(kubectl get secret sciety--staging--secret-env-vars -o json | jq -r '.data.PGPASSWORD'| base64 -d) \
	-- psql

staging-events-row-count: verify-flux-prod-cluster
	kubectl run psql \
	--image=postgres:12.3 \
	--env=PGHOST=$$(kubectl get configmap sciety--staging--public-env-vars -o json | jq -r '.data.PGHOST') \
	--env=PGDATABASE=$$(kubectl get configmap sciety--staging--public-env-vars -o json | jq -r '.data.PGDATABASE') \
	--env=PGUSER=$$(kubectl get configmap sciety--staging--public-env-vars -o json | jq -r '.data.PGUSER') \
	--env=PGPASSWORD=$$(kubectl get secret sciety--staging--secret-env-vars -o json | jq -r '.data.PGPASSWORD'| base64 -d) \
	-- sleep 600
	kubectl wait --for condition=Ready pod psql
	kubectl exec psql -- psql -c "SELECT count(*) FROM events;"
	kubectl delete --wait=false pod psql

prod-sql:
	kubectl run psql \
	--rm -it --image=postgres:12.3 \
	--env=PGHOST=$$(kubectl get configmap sciety--prod--public-env-vars -o json | jq -r '.data.PGHOST') \
	--env=PGDATABASE=$$(kubectl get configmap sciety--prod--public-env-vars -o json | jq -r '.data.PGDATABASE') \
	--env=PGUSER=$$(kubectl get configmap sciety--prod--public-env-vars -o json | jq -r '.data.PGUSER') \
	--env=PGPASSWORD=$$(kubectl get secret sciety--prod--secret-env-vars -o json | jq -r '.data.PGPASSWORD'| base64 -d) \
	-- psql

prod-events-row-count:
	kubectl run psql \
	--image=postgres:12.3 \
	--env=PGHOST=$$(kubectl get configmap sciety--prod--public-env-vars -o json | jq -r '.data.PGHOST') \
	--env=PGDATABASE=$$(kubectl get configmap sciety--prod--public-env-vars -o json | jq -r '.data.PGDATABASE') \
	--env=PGUSER=$$(kubectl get configmap sciety--prod--public-env-vars -o json | jq -r '.data.PGUSER') \
	--env=PGPASSWORD=$$(kubectl get secret sciety--prod--secret-env-vars -o json | jq -r '.data.PGPASSWORD'| base64 -d) \
	-- sleep 600
	kubectl wait --for condition=Ready pod psql
	kubectl exec psql -- psql -c "SELECT count(*) FROM events;"
	kubectl delete --wait=false pod psql

feature-test: export TARGET = fast
feature-test: export USE_STUB_ADAPTERS = true
feature-test: export USE_STUB_AVATARS = true
feature-test: export USE_STUB_LOGIN = true
feature-test: export DISPLAY_LAST_SERVER_STARTUP = false
feature-test: node_modules clean-db build
	${DOCKER_COMPOSE} up -d
	scripts/wait-for-healthy.sh
	npx jest ${TEST} --testTimeout=300000 --cache-directory=.jest-feature-test --roots ./feature-test/
	${DOCKER_COMPOSE} down

download-exploratory-test-from-prod:
	rm -rf "./data/exploratory-test-from-prod.csv"
	aws s3 cp "s3://sciety-events-export/sciety--prod--events-from-cronjob.csv" "./data/exploratory-test-from-prod.csv"

download-exploratory-test-from-staging:
	rm -rf "./data/exploratory-test-from-staging.csv"
	aws s3 cp "s3://sciety-events-export/sciety--staging--events-from-cronjob.csv" "./data/exploratory-test-from-staging.csv"

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

exploratory-test-from-staging: node_modules clean-db build
	@if ! [[ -f 'data/exploratory-test-from-staging.csv' ]]; then \
    echo "Ensure you have run: make download-exploratory-test-from-staging"; exit 1; \
	fi
	${DOCKER_COMPOSE} up -d db
	scripts/wait-for-database.sh
	${DOCKER_COMPOSE} exec -T db psql -c "CREATE TABLE IF NOT EXISTS events ( id uuid, type varchar, date timestamp, payload jsonb, PRIMARY KEY (id));" sciety user
	${DOCKER_COMPOSE} exec -T db psql -c "COPY events FROM '/data/exploratory-test-from-staging.csv' WITH CSV HEADER" sciety user
	${DOCKER_COMPOSE} up -d app
	scripts/wait-for-healthy.sh
	${DOCKER_COMPOSE} logs -f app

FLUX_PROD_CLUSTER_CONTROL_PLANE_ADDRESS := https://0108D0073AFB87B6669E378F0A9CFB76.gr7.us-east-1.eks.amazonaws.com
verify-flux-prod-cluster:
	kubectl cluster-info | grep $(FLUX_PROD_CLUSTER_CONTROL_PLANE_ADDRESS) > /dev/null

switch-to-flux-prod-cluster:
	kubectl config use-context arn:aws:eks:us-east-1:512686554592:cluster/kubernetes-aws--flux-prod

replace-staging-database--with-snapshot-from-prod: verify-flux-prod-cluster download-exploratory-test-from-prod
	kubectl --namespace sciety run psql \
	--image=postgres:12.3 \
	--env=PGHOST=$$(kubectl --namespace sciety get configmap sciety--staging--public-env-vars -o json | jq -r '.data.PGHOST') \
	--env=PGDATABASE=$$(kubectl --namespace sciety get configmap sciety--staging--public-env-vars -o json | jq -r '.data.PGDATABASE') \
	--env=PGUSER=$$(kubectl --namespace sciety get configmap sciety--staging--public-env-vars -o json | jq -r '.data.PGUSER') \
	--env=PGPASSWORD=$$(kubectl --namespace sciety get secret sciety--staging--secret-env-vars -o json | jq -r '.data.PGPASSWORD'| base64 -d) \
	-- sleep 600
	kubectl --namespace sciety wait --for condition=Ready pod psql
	kubectl --namespace sciety exec psql -- psql -c "DELETE FROM events"
	kubectl --namespace sciety exec psql -- mkdir /data
	kubectl --namespace sciety cp ./data/exploratory-test-from-prod.csv psql:/data/exploratory-test-from-prod.csv
	kubectl --namespace sciety exec psql -- psql -c "\copy events FROM '/data/exploratory-test-from-prod.csv' WITH CSV HEADER"
	kubectl --namespace sciety delete --wait=false pod psql
	kubectl --namespace sciety rollout restart deployment sciety--staging--frontend
	kubectl --namespace sciety wait pod --for=condition=Ready --selector=app.kubernetes.io/component=frontend,app.kubernetes.io/instance=sciety--staging --timeout=120s

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
	npx sass --load-path=src/read-side/html-pages/shared-sass --no-source-map src/read-side/html-pages/style.scss:.purgecss/full.css
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

clean:
	rm -rf $(MK_LINTED_SASS) $(MK_LINTED_TS) $(MK_TESTED_TS)
	rm -rf $(LINT_CACHE)
	rm -rf $(STYLELINT_CACHE)
	$(MAKE) -C $(GRAPH_DIR) clean

clobber: clean
	rm -rf build node_modules

check-ci: compile-prod check

compile-prod: export TARGET = prod
compile-prod: .env build

connect-to-cache:
	kubectl run --namespace default redis-client --tty -i --rm --image redis -- bash

connect-to-cache-dev:
	docker run --tty -i --rm --network sciety_default redis bash

helm-dry-run:
	helm install --debug --dry-run --set hostname=example.sciety.org sciety--example ./helm/sciety
