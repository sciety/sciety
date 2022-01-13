ifeq (${TARGET},)
TARGET := dev
endif

DOCKER_COMPOSE = docker-compose --file docker-compose.yml --file docker-compose.$(TARGET).yml
DATA_VOLUME := $(shell pwd)
IMAGE := sciety/sciety
IMAGE_TAG := local
PORT := 8080
AWS_DEFAULT_REGION := us-east-1

export IMAGE
export IMAGE_TAG
export AWS_DEFAULT_REGION


.PHONY: backstop* build clean* dev find-* get* git-lfs ingest* install lint* prod release stop test* update*

dev: export TARGET = dev
dev: .env install build
	${DOCKER_COMPOSE} up --abort-on-container-exit --exit-code-from app

prod: export TARGET = prod
prod: .env build
	${DOCKER_COMPOSE} up --abort-on-container-exit --exit-code-from app

dev-redis-cache-list-keys: export TARGET = dev
dev-redis-cache-list-keys:
	${DOCKER_COMPOSE} exec cache redis-cli HKEYS axios-cache

.env:
	cp .env.example .env

.gcp-ncrc-key.json:
	gcloud iam service-accounts keys create ./.gcp-ncrc-key.json --iam-account ncrc-sheet@sciety.iam.gserviceaccount.com

unused-sass: node_modules find-unused-sass-declarations
	rm -f .purgecss/{full,purged}.css
	npx sass --no-source-map src/sass/style.scss:.purgecss/full.css
	npx purgecss --config purgecss.config.js --css .purgecss/full.css --output .purgecss/purged.css
	diff .purgecss/full.css .purgecss/purged.css

find-unused-sass-declarations: node_modules
	npx sass-unused 'src/**/*.scss'

lint: export TARGET = dev
lint: build unused-sass
	${DOCKER_COMPOSE} run --rm app npm run lint

lint\:fix: export TARGET = dev
lint\:fix: build unused-sass
	${DOCKER_COMPOSE} run --rm -e ESLINT=--fix -e STYLELINT=--fix app npm run lint

test: export TARGET = dev
test: build
	${DOCKER_COMPOSE} run --rm app npm run test

test\:coverage: export TARGET = dev
test\:coverage: build
	${DOCKER_COMPOSE} run --rm app npm run test:coverage
	sed -i -e 's/\/app\/src/src/g' coverage/coverage-final.json

backstop-test: export TARGET = dev
backstop-test: export DISABLE_COOKIEBOT = true
backstop-test: node_modules clean-db build
	${DOCKER_COMPOSE} up -d
	scripts/wait-for-healthy.sh
	${DOCKER_COMPOSE} exec -T db psql -c "copy events from '/data/backstop.csv' with CSV" sciety user
	${DOCKER_COMPOSE} restart app
	scripts/wait-for-healthy.sh
	npx backstop --docker test
	${DOCKER_COMPOSE} down

backstop-approve: export LATEST_TEST_PNG_FOLDER=$(shell ls -1 backstop_data/bitmaps_test/ | sort | tail -n 1)
backstop-approve: node_modules
	cp backstop_data/bitmaps_test/$$LATEST_TEST_PNG_FOLDER/backstop_default*.png backstop_data/bitmaps_reference/
	git status

build:
	$(DOCKER_COMPOSE) build app

install: node_modules git-lfs

node_modules: export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true
node_modules: package.json package-lock.json
	npm install
	touch node_modules

git-lfs:
	git lfs install

clean:
	rm -rf .eslint .jest .stylelint build node_modules static/style.css static/style.css.map

clean-db: stop

stop:
	$(DOCKER_COMPOSE) down

ingest-events: export TARGET = dev
ingest-events: build
	$(DOCKER_COMPOSE) run --name ingest --rm \
	-e INGEST_DEBUG=${INGEST_DEBUG} \
	-e INGEST_ONLY=${INGEST_ONLY} \
	-e INGEST_DAYS=${INGEST_DAYS} \
	app \
	npx ts-node src/ingest/update-event-data

update-event-data: ingest-events backstop-test

release: export TAG = latest/$(shell date +%Y%m%d%H%M)
release:
	git tag $$TAG
	git push origin $$TAG

prod-sql:
	kubectl run psql \
	--rm -it --image=postgres:12.3 \
	--env=PGHOST=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-host"'| base64 -d) \
	--env=PGDATABASE=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-database"'| base64 -d) \
	--env=PGUSER=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-username"'| base64 -d) \
	--env=PGPASSWORD=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-password"'| base64 -d) \
	-- psql

update-db-dump:
	kubectl run psql \
	--image=postgres:12.3 \
	--env=PGHOST=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-host"'| base64 -d) \
	--env=PGDATABASE=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-database"'| base64 -d) \
	--env=PGUSER=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-username"'| base64 -d) \
	--env=PGPASSWORD=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-password"'| base64 -d) \
	-- sleep 60
	kubectl wait --for condition=Ready pod psql
	kubectl exec psql -- psql -c "copy (select json_agg(events) from events) To STDOUT;" | sed -e 's/\\n//g' > ./events.json
	kubectl delete --wait=false pod psql
	gcloud config set project sciety
	gsutil cp events.json gs://sciety-data/events/events.json
	gsutil acl set public-read gs://sciety-data/events/events.json

taiko: export TARGET = dev
taiko: export AUTHENTICATION_STRATEGY = local
taiko: export INGESTION_AUTH_BEARER_TOKEN = secret
taiko: node_modules clean-db
	${DOCKER_COMPOSE} up -d
	scripts/wait-for-healthy.sh
	npx jest ${TEST} --testTimeout=300000 --bail --cache-directory=.jest-taiko --roots ./feature-test/
	${DOCKER_COMPOSE} down

regression: taiko

render-sanitised-markdown: node_modules
	npx ts-node --transpile-only ./scripts/hypothesis-review-render-testbed.ts

download-exploratory-test-from-prod:
	kubectl run psql \
	--image=postgres:12.3 \
	--env=PGHOST=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-host"'| base64 -d) \
	--env=PGDATABASE=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-database"'| base64 -d) \
	--env=PGUSER=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-username"'| base64 -d) \
	--env=PGPASSWORD=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-password"'| base64 -d) \
	-- sleep 60
	kubectl wait --for condition=Ready pod psql
	kubectl exec psql -- psql -c "COPY (SELECT * FROM events ORDER BY date ASC) TO STDOUT CSV;" > ./data/exploratory-test-from-prod.csv
	kubectl delete --wait=false pod psql

exploratory-test-from-prod: node_modules clean-db build
	${DOCKER_COMPOSE} up -d
	scripts/wait-for-healthy.sh
	${DOCKER_COMPOSE} exec -T db psql -c "COPY events FROM '/data/exploratory-test-from-prod.csv' WITH CSV" sciety user
	${DOCKER_COMPOSE} restart app
	scripts/wait-for-healthy.sh
	${DOCKER_COMPOSE} logs -f app

exploratory-test: node_modules clean-db build
	${DOCKER_COMPOSE} up -d
	scripts/wait-for-healthy.sh
	${DOCKER_COMPOSE} exec -T db psql -c "copy events from '/data/exploratory-test.csv' with CSV" sciety user
	${DOCKER_COMPOSE} restart app
	scripts/wait-for-healthy.sh
	${DOCKER_COMPOSE} logs -f app

download-db-dump-staging:
	kubectl run psql \
	--image=postgres:12.3 \
	--env=PGHOST=$$(kubectl get secret hive-staging-rds-postgres -o json | jq -r '.data."postgresql-host"'| base64 -d) \
	--env=PGDATABASE=$$(kubectl get secret hive-staging-rds-postgres -o json | jq -r '.data."postgresql-database"'| base64 -d) \
	--env=PGUSER=$$(kubectl get secret hive-staging-rds-postgres -o json | jq -r '.data."postgresql-username"'| base64 -d) \
	--env=PGPASSWORD=$$(kubectl get secret hive-staging-rds-postgres -o json | jq -r '.data."postgresql-password"'| base64 -d | sed -e 's/\$$\$$/$$$$$$$$/g') \
	-- sleep 600
	kubectl wait --for condition=Ready pod psql
	kubectl exec psql -- psql -c "copy (select json_agg(events) from events) To STDOUT;" | sed -e 's/\\n//g' > ./events-staging.json
	kubectl delete --wait=false pod psql

get-error-logs:
	@export $$(cat .env | grep LOKI | xargs) && \
	logcli query -q -o raw --limit 600000 --batch 5000 \
	--timezone=UTC \
	--from="2021-09-10T00:00:00Z" \
	'{app_kubernetes_io_instance="sciety--prod"} | json | __error__="" | level = "error"'


.gs-events-json-to-jsonl:
	gsutil cat "gs://sciety-data/events/events.json" \
		| jq -c '.[]' \
		| gsutil cp - "gs://sciety-data/events/events.jsonl" \

.bq-update-events: .gs-events-json-to-jsonl
	bq load \
		--project_id=elife-data-pipeline \
		--autodetect \
		--replace \
		--source_format=NEWLINE_DELIMITED_JSON \
		de_proto.sciety_event_v1 \
		"gs://sciety-data/events/events.jsonl"

update-datastudio: update-db-dump .bq-update-events
	./scripts/upload-evaluations-from-local-files-to-bigquery.sh
	./scripts/upload-ingress-logs-from-cloudwatch-to-bigquery.sh

crossref-response:
	curl -v \
		-H 'Accept: application/vnd.crossref.unixref+xml' \
		-H 'User-Agent: Sciety (https://sciety.org; mailto:team@sciety.org)' \
		'https://api.crossref.org/works/${DOI}/transform'