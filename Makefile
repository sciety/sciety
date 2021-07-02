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

find-review-commons-reviews: export TARGET = dev
find-review-commons-reviews: build
	$(DOCKER_COMPOSE) run -T app \
		npx ts-node scripts/find-reviews-from-hypothesis NEGQVabn > ./data/reviews/316db7d9-88cc-4c26-b386-f067e0f56334.csv

find-elife-reviews: export TARGET = dev
find-elife-reviews: build
	$(DOCKER_COMPOSE) run -T app \
		npx ts-node scripts/find-reviews-from-hypothesis q5X6RWJ6 > ./data/reviews/b560187e-f2fb-4ff9-a861-a204f3fc0fb0.csv

find-peerj-reviews: export TARGET = dev
find-peerj-reviews: build
	$(DOCKER_COMPOSE) run -T app \
		npx ts-node scripts/find-reviews-from-crossref-via-biorxiv 10.7717 10.7287 > ./data/reviews/53ed5364-a016-11ea-bb37-0242ac130002.csv

find-pci-reviews: export TARGET = dev
find-pci-reviews: build
	$(DOCKER_COMPOSE) run -T app \
	npx ts-node scripts/find-reviews-from-pci

find-prereview-reviews: export TARGET = dev
find-prereview-reviews: build
	$(DOCKER_COMPOSE) run -T app \
		npx ts-node scripts/find-reviews-from-prereview > ./data/reviews/10360d97-bf52-4aef-b2fa-2f60d319edd7.csv

find-ncrc-reviews: export TARGET = dev
find-ncrc-reviews: build .gcp-ncrc-key.json
	$(DOCKER_COMPOSE) run -T app \
		npx ts-node scripts/find-reviews-from-ncrc > ./data/reviews/62f9b0d0-8d43-4766-a52a-ce02af61bc6a.csv

find-screenit-reviews: export TARGET = dev
find-screenit-reviews: build
	$(DOCKER_COMPOSE) run -T app \
		npx ts-node scripts/find-reviews-from-hypothesis-user sciscore | sort -g | uniq > ./data/reviews/8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65.csv

find-prelights-reviews: export TARGET = dev
find-prelights-reviews: build
	$(DOCKER_COMPOSE) run -T app \
		npx ts-node scripts/find-reviews-from-prelights >> ./data/reviews/f97bd177-5cb6-4296-8573-078318755bf2.csv
		cat ./data/reviews/f97bd177-5cb6-4296-8573-078318755bf2.csv | sort -g | uniq > /tmp/prelights.csv
		mv /tmp/prelights.csv ./data/reviews/f97bd177-5cb6-4296-8573-078318755bf2.csv

find-rapid-reviews: export TARGET = dev
find-rapid-reviews: build
	$(DOCKER_COMPOSE) run -T app \
		npx ts-node scripts/find-reviews-from-rapid-reviews > ./data/reviews/5142a5bc-6b18-42b1-9a8d-7342d7d17e94.csv

COMMUNITY_SCRIPTS := \
	find-review-commons-reviews \
	find-elife-reviews \
	find-peerj-reviews \
	find-pci-reviews \
	find-screenit-reviews \
	find-prereview-reviews \
	find-ncrc-reviews \
	find-prelights-reviews \
	find-rapid-reviews

sort-event-data:
	find data -type f | xargs -I % sort -g -o % %

update-event-data: $(COMMUNITY_SCRIPTS) sort-event-data

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
taiko: clean-db
	${DOCKER_COMPOSE} up -d
	scripts/wait-for-healthy.sh
	npx jest ${TEST} --testTimeout=300000 --bail --cache-directory=.jest-taiko --roots ./feature-test/
	${DOCKER_COMPOSE} down

regression: taiko

render-sanitised-markdown: node_modules
	npx ts-node --transpile-only ./scripts/hypothesis-review-render-testbed.ts
