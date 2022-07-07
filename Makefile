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


.PHONY: backstop* build clean* dev find-* get* git-lfs ingest* install lint* prod release replay-events-for-elife-subject-area-policy stop test* update* watch*

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

watch\:typescript: node_modules
	npm run watch:typescript

lint: export TARGET = dev
lint: build unused-sass
	${DOCKER_COMPOSE} run --rm app npm run lint

lint\:fix: export TARGET = dev
lint\:fix: build unused-sass
	${DOCKER_COMPOSE} run --rm -e ESLINT=--fix -e STYLELINT=--fix app npm run lint

lint\:sass: export TARGET = dev
lint\:sass: build unused-sass
	${DOCKER_COMPOSE} run --rm app npm run lint:stylelint

test: export TARGET = dev
test: build
	${DOCKER_COMPOSE} run --rm app npm run test

test\:coverage: export TARGET = dev
test\:coverage: build
	${DOCKER_COMPOSE} run --rm app npm run test:coverage
	sed -i -e 's/\/app\/src/src/g' coverage/coverage-final.json

jest-test:
	npx jest ${TEST}

backstop-test: export TARGET = prod
backstop-test: export DISABLE_COOKIEBOT = true
backstop-test: node_modules clean-db build
	${DOCKER_COMPOSE} up -d
	scripts/wait-for-healthy.sh
	${DOCKER_COMPOSE} exec -T db psql -c "copy events from '/data/backstop.csv' with CSV" sciety user
	${DOCKER_COMPOSE} restart app lists
	scripts/wait-for-healthy.sh
	npx backstop --docker --filter="${SCENARIO}" test
	${DOCKER_COMPOSE} down

exploratory-test-backstop: export TARGET = prod
exploratory-test-backstop: export DISABLE_COOKIEBOT = true
exploratory-test-backstop: node_modules clean-db build
	${DOCKER_COMPOSE} up -d
	scripts/wait-for-healthy.sh
	${DOCKER_COMPOSE} exec -T db psql -c "copy events from '/data/backstop.csv' with CSV" sciety user
	${DOCKER_COMPOSE} restart app lists
	${DOCKER_COMPOSE} up

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

manual-deploy-to-prod: export TAG = latest/$(shell date +%Y%m%d%H%M)
manual-deploy-to-prod:
	git tag $$TAG
	git push origin $$TAG

dev-sql: export TARGET = dev
dev-sql:
	$(DOCKER_COMPOSE) exec -e PGUSER=user -e PGPASSWORD=secret -e PGDATABASE=sciety db psql

staging-sql:
	kubectl run psql \
	--rm -it --image=postgres:12.3 \
	--env=PGHOST=$$(kubectl get secret hive-staging-rds-postgres -o json | jq -r '.data."postgresql-host"'| base64 -d) \
	--env=PGDATABASE=$$(kubectl get secret hive-staging-rds-postgres -o json | jq -r '.data."postgresql-database"'| base64 -d) \
	--env=PGUSER=$$(kubectl get secret hive-staging-rds-postgres -o json | jq -r '.data."postgresql-username"'| base64 -d) \
	--env=PGPASSWORD=$$(kubectl get secret hive-staging-rds-postgres -o json | jq -r '.data."postgresql-password"'| base64 -d | sed -e 's/\$$\$$/$$$$$$$$/g') \
	-- psql

prod-sql:
	kubectl run psql \
	--rm -it --image=postgres:12.3 \
	--env=PGHOST=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-host"'| base64 -d) \
	--env=PGDATABASE=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-database"'| base64 -d) \
	--env=PGUSER=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-username"'| base64 -d) \
	--env=PGPASSWORD=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-password"'| base64 -d) \
	-- psql

taiko: export TARGET = dev
taiko: export AUTHENTICATION_STRATEGY = local
taiko: export SCIETY_TEAM_API_BEARER_TOKEN = secret
taiko: node_modules clean-db
	${DOCKER_COMPOSE} up -d
	scripts/wait-for-healthy.sh
	${DOCKER_COMPOSE} exec -T db psql -c "copy events from '/data/taiko.csv' with CSV" sciety user
	${DOCKER_COMPOSE} restart app lists
	scripts/wait-for-healthy.sh
	npx jest ${TEST} --testTimeout=300000 --bail --cache-directory=.jest-taiko --roots ./feature-test/
	${DOCKER_COMPOSE} down

download-exploratory-test-from-prod:
	kubectl run --rm --attach ship-events \
		--image=amazon/aws-cli:2.4.23 \
		--command=true \
		--restart=Never \
		--env=PGHOST=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-host"'| base64 -d) \
		--env=PGDATABASE=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-database"'| base64 -d) \
		--env=PGUSER=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-username"'| base64 -d) \
		--env=PGPASSWORD=$$(kubectl get secret hive-prod-rds-postgres -o json | jq -r '.data."postgresql-password"'| base64 -d) \
		--env=AWS_ACCESS_KEY_ID=$$(kubectl get secret sciety-events-shipper-aws-credentials -o json | jq -r '.data."id"'| base64 -d) \
		--env=AWS_SECRET_ACCESS_KEY=$$(kubectl get secret sciety-events-shipper-aws-credentials -o json | jq -r '.data."secret"'| base64 -d) \
		-- \
		bash -c 'yum install --assumeyes --quiet postgresql \
			&& psql -c "COPY (SELECT * FROM events ORDER BY date ASC) TO STDOUT CSV;" > ./events.csv \
			&& aws s3 cp "./events.csv" "s3://sciety-data-extractions/events.csv" \
		'
	aws s3 cp "s3://sciety-data-extractions/events.csv" "./data/exploratory-test-from-prod.csv"

exploratory-test-from-prod: node_modules clean-db build
	${DOCKER_COMPOSE} up -d
	scripts/wait-for-healthy.sh
	${DOCKER_COMPOSE} exec -T db psql -c "COPY events FROM '/data/exploratory-test-from-prod.csv' WITH CSV" sciety user
	${DOCKER_COMPOSE} restart app lists
	scripts/wait-for-healthy.sh
	${DOCKER_COMPOSE} logs -f app

exploratory-test: node_modules clean-db build
	${DOCKER_COMPOSE} up -d
	scripts/wait-for-healthy.sh
	${DOCKER_COMPOSE} exec -T db psql -c "copy events from '/data/exploratory-test.csv' with CSV" sciety user
	${DOCKER_COMPOSE} restart app lists
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

crossref-response:
	curl -v \
		-H 'Accept: application/vnd.crossref.unixref+xml' \
		-H 'User-Agent: Sciety (https://sciety.org; mailto:team@sciety.org)' \
		'https://api.crossref.org/works/${DOI}/transform'

replay-events-for-elife-subject-area-policy:
	kubectl delete job elife-subject-area-policy || true
	kubectl create job --from=cronjob/sciety--prod--elife-subject-area-policy elife-subject-area-policy 

dev-replay-events-for-elife-subject-area-policy: export TARGET = dev
dev-replay-events-for-elife-subject-area-policy: build
	$(DOCKER_COMPOSE) run --name elife-subject-area-policy --rm \
	app \
	npx ts-node --project tsconfig.dev.json --transpile-only src/policies/run-elife-subject-area-policy
