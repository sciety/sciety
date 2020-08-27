ifeq (${TARGET},)
TARGET := dev
endif

DOCDIR := docs
DOCKER_COMPOSE = docker-compose --file .docker/docker-compose.yml --file .docker/docker-compose.$(TARGET).yml
DATA_VOLUME := $(shell pwd)
IMAGE := liberoadmin/prc-frontend
IMAGE_TAG := local
PORT := 8080

export IMAGE
export IMAGE_TAG

.PHONY: build clean* dev find-* install lint* prod release test* update-event-data

dev: export TARGET = dev
dev: .env install build
	${DOCKER_COMPOSE} up --abort-on-container-exit --exit-code-from app

prod: export TARGET = prod
prod: .env build
	${DOCKER_COMPOSE} up --abort-on-container-exit --exit-code-from app

.env:
	touch .env

lint: export TARGET = dev
lint: build
	${DOCKER_COMPOSE} run --rm app npm run lint

lint\:fix: export TARGET = dev
lint\:fix: build
	${DOCKER_COMPOSE} run --rm app npm run lint:fix

test: export TARGET = dev
test: build
	${DOCKER_COMPOSE} run --rm app npm run test

test\:coverage: export TARGET = dev
test\:coverage: build
	${DOCKER_COMPOSE} run --rm app npm run test:coverage

build:
	$(DOCKER_COMPOSE) build

deps: export TARGET = dev
deps: $(DOCDIR)/folders.svg $(DOCDIR)/modules.svg

$(DOCDIR)/folders.svg: $(DOCDIR) build
	$(DOCKER_COMPOSE) run app npm run --silent deps:folders \
	| docker run --interactive --rm risaacson/graphviz dot -Tsvg \
	> $(DOCDIR)/folders.svg

$(DOCDIR)/modules.svg: $(DOCDIR) build
	$(DOCKER_COMPOSE) run app npm run --silent deps:modules \
	| docker run --interactive --rm risaacson/graphviz dot -Tsvg \
	> $(DOCDIR)/modules.svg

$(DOCDIR):
	mkdir -p $(DOCDIR)

install: node_modules

node_modules: package.json package-lock.json
	npm install
	touch node_modules

clean:
	rm -rf .eslint .jest build node_modules

clean\:db:
	$(DOCKER_COMPOSE) down

find-elife-endorsements: export TARGET = dev
find-elife-endorsements: build
	$(DOCKER_COMPOSE) run app npx ts-node scripts/find-endorsements-from-biorxiv 10.7554 \
	| tee ./data/endorsements/b560187e-f2fb-4ff9-a861-a204f3fc0fb0.csv

find-peerj-endorsements: export TARGET = dev
find-peerj-endorsements: build
	$(DOCKER_COMPOSE) run app npx ts-node scripts/find-endorsements-from-biorxiv 10.7717 \
	| tee ./data/endorsements/53ed5364-a016-11ea-bb37-0242ac130002.csv

find-review-commons-reviews: export TARGET = dev
find-review-commons-reviews: build
	$(DOCKER_COMPOSE) run app npx ts-node scripts/find-reviews-from-hypothesis NEGQVabn \
	| tee ./data/reviews/316db7d9-88cc-4c26-b386-f067e0f56334.csv

find-elife-reviews: export TARGET = dev
find-elife-reviews: build
	$(DOCKER_COMPOSE) run app npx ts-node scripts/find-reviews-from-hypothesis q5X6RWJ6 \
	| tee ./data/reviews/b560187e-f2fb-4ff9-a861-a204f3fc0fb0.csv

find-peerj-reviews: export TARGET = dev
find-peerj-reviews: build
	$(DOCKER_COMPOSE) run app npx ts-node scripts/find-reviews-from-crossref-via-biorxiv 10.7717 10.7287 \
	| tee ./data/reviews/53ed5364-a016-11ea-bb37-0242ac130002.csv

find-pci-reviews: export TARGET = dev
find-pci-reviews: build
	$(DOCKER_COMPOSE) run app npx ts-node scripts/find-reviews-from-pci

COMMUNITY_SCRIPTS := \
	find-elife-endorsements \
	find-peerj-endorsements \
	find-review-commons-reviews \
	find-elife-reviews \
	find-peerj-reviews \
	find-pci-reviews

update-event-data: $(COMMUNITY_SCRIPTS)

release: export TAG = latest/$(shell date +%Y%m%d%H%M)
release:
	git tag $$TAG
	git push origin $$TAG
