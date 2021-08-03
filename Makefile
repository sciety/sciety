ifeq (${TARGET},)
TARGET := dev
endif

DOCKER_COMPOSE = docker-compose --file docker-compose.yml --file docker-compose.$(TARGET).yml
DATA_VOLUME := $(shell pwd)
IMAGE := sciety/sciety
IMAGE_TAG := local
PORT := 8080

export IMAGE
export IMAGE_TAG

.PHONY: backstop* build clean* dev find-* git-lfs install lint* prod release stop test* update-event-data

dev: export TARGET = dev
dev: .env install build
	${DOCKER_COMPOSE} up --abort-on-container-exit --exit-code-from app

prod: export TARGET = prod
prod: .env build
	${DOCKER_COMPOSE} up --abort-on-container-exit --exit-code-from app

.env:
	cp .env.example .env

.gcp-ncrc-key.json:
	gcloud iam service-accounts keys create ./.gcp-ncrc-key.json --iam-account ncrc-sheet@sciety.iam.gserviceaccount.com

lint: export TARGET = dev
lint: build
	${DOCKER_COMPOSE} run --rm app npm run lint

lint\:fix: export TARGET = dev
lint\:fix: build
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

backstop-approve: node_modules
	npx backstop approve

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

find-peerj-reviews: export TARGET = dev
find-peerj-reviews: build
	$(DOCKER_COMPOSE) run -T app \
		npx ts-node src/ingest/find-reviews-from-crossref-via-biorxiv 10.7717 10.7287 > ./data/reviews/53ed5364-a016-11ea-bb37-0242ac130002.csv

find-screenit-reviews: export TARGET = dev
find-screenit-reviews: build
	$(DOCKER_COMPOSE) run -T app \
		npx ts-node src/ingest/find-reviews-from-hypothesis-user sciscore >> ./data/reviews/8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65.csv
		cat ./data/reviews/8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65.csv | sort -g | uniq > /tmp/8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65.csv
		mv /tmp/8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65.csv ./data/reviews/8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65.csv

update-groups: export TARGET = dev
update-groups: build
	$(DOCKER_COMPOSE) run -e INGEST_LOG=${INGEST_LOG} -e INGEST_ONLY=${INGEST_ONLY} app \
	npx ts-node src/ingest/update-event-data

COMMUNITY_SCRIPTS := \
	find-peerj-reviews \
	find-screenit-reviews

sort-event-data:
	find data -type f | xargs -I % sort -g -o % %

update-event-data: update-groups $(COMMUNITY_SCRIPTS) sort-event-data

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

taiko: export TARGET = dev
taiko: export AUTHENTICATION_STRATEGY = local
taiko: node_modules clean-db
	${DOCKER_COMPOSE} up -d
	scripts/wait-for-healthy.sh
	npx jest ${TEST} --testTimeout=300000 --bail --cache-directory=.jest-taiko --roots ./feature-test/
	${DOCKER_COMPOSE} down

regression: taiko

render-sanitised-markdown: node_modules
	npx ts-node --transpile-only ./scripts/hypothesis-review-render-testbed.ts
