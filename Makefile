DOCDIR := docs
DOCKER := docker
DATA_VOLUME := $(shell pwd)
IMAGE := liberoadmin/prc-frontend
IMAGE_TAG := local
PORT := 8080

.PHONY: build clean dev install lint* prod test

dev: export TARGET = dev
dev: install build
	touch .env
	$(DOCKER) run -it \
		-v $(DATA_VOLUME)/data:/app/data:ro \
		-v $(DATA_VOLUME)/src:/app/src:ro \
		-v $(DATA_VOLUME)/static:/app/static:ro \
		-p $(PORT):80 \
		--env-file .env \
		$(IMAGE):$(IMAGE_TAG)-dev

prod: export TARGET = prod
prod: build
	touch .env
	$(DOCKER) run \
		-p $(PORT):80 \
		--env-file .env \
		$(IMAGE):$(IMAGE_TAG)

lint: export TARGET = dev
lint: build
	$(DOCKER) run --rm \
		-v $(DATA_VOLUME)/.eslint:/app/.eslint \
		-v $(DATA_VOLUME)/build:/app/build \
		$(IMAGE):$(IMAGE_TAG)-dev \
		npm run lint

lint\:fix: export TARGET = dev
lint\:fix: build
	$(DOCKER) run --rm \
		-v $(DATA_VOLUME)/.eslint:/app/.eslint \
		-v $(DATA_VOLUME)/build:/app/build \
		-v $(DATA_VOLUME)/scripts:/app/scripts \
		-v $(DATA_VOLUME)/src:/app/src \
		-v $(DATA_VOLUME)/test:/app/test \
		$(IMAGE):$(IMAGE_TAG)-dev \
		npm run lint:fix

test: export TARGET = dev
test: build
	$(DOCKER) run \
		-v $(DATA_VOLUME)/.jest:/app/.jest \
		-v $(DATA_VOLUME)/build:/app/build \
		$(IMAGE):$(IMAGE_TAG)-dev \
		npm run test

test\:coverage: export TARGET = dev
test\:coverage: build
	$(DOCKER) run \
		-v $(DATA_VOLUME)/.jest:/app/.jest \
		-v $(DATA_VOLUME)/src:/app/src \
		-v $(DATA_VOLUME)/test:/app/test \
		$(IMAGE):$(IMAGE_TAG)-dev \
		npm run test:coverage

build:
	@if [ "$(TARGET)" != prod ]; then \
		image_tag_suffix=-dev; \
	fi; \
	$(DOCKER) build -t $(IMAGE):$(IMAGE_TAG)$${image_tag_suffix} . --target $(TARGET)

deps: export TARGET = dev
deps: $(DOCDIR)/folders.png $(DOCDIR)/modules.png

$(DOCDIR)/folders.png: $(DOCDIR) build
	$(DOCKER) run \
		-v $(DATA_VOLUME)/docs:/app/docs \
		$(IMAGE):$(IMAGE_TAG)-dev \
		npm run deps:folders

$(DOCDIR)/modules.png: $(DOCDIR) build
	$(DOCKER) run \
		-v $(DATA_VOLUME)/docs:/app/docs \
		$(IMAGE):$(IMAGE_TAG)-dev \
		npm run deps:modules

$(DOCDIR):
	mkdir -p $(DOCDIR)

install: node_modules

node_modules: package.json package-lock.json
	npm install
	touch node_modules

clean:
	rm -rf .eslint .jest build node_modules

find-elife-endorsements: export TARGET = dev
find-elife-endorsements: build
	$(DOCKER) run \
		-v $(DATA_VOLUME)/build:/app/build \
		-v $(DATA_VOLUME)/scripts:/app/scripts \
		-v $(DATA_VOLUME)/src:/app/src \
		$(IMAGE):$(IMAGE_TAG)-dev \
		npx ts-node scripts/find-endorsements-from-biorxiv 10.7554 | tee ./data/endorsements/b560187e-f2fb-4ff9-a861-a204f3fc0fb0.csv

find-peerj-endorsements: export TARGET = dev
find-peerj-endorsements: build
	$(DOCKER) run \
		-v $(DATA_VOLUME)/build:/app/build \
		-v $(DATA_VOLUME)/scripts:/app/scripts \
		-v $(DATA_VOLUME)/src:/app/src \
		$(IMAGE):$(IMAGE_TAG)-dev \
		npx ts-node scripts/find-endorsements-from-biorxiv 10.7717  | tee ./data/endorsements/53ed5364-a016-11ea-bb37-0242ac130002.csv

find-review-commons-reviews: export TARGET = dev
find-review-commons-reviews: build
	$(DOCKER) run \
		-v $(DATA_VOLUME)/build:/app/build \
		-v $(DATA_VOLUME)/scripts:/app/scripts \
		-v $(DATA_VOLUME)/src:/app/src \
		$(IMAGE):$(IMAGE_TAG)-dev \
		npx ts-node scripts/find-reviews-from-hypothesis NEGQVabn | tee ./data/reviews/316db7d9-88cc-4c26-b386-f067e0f56334.csv

find-elife-reviews: export TARGET = dev
find-elife-reviews: build
	$(DOCKER) run \
		-v $(DATA_VOLUME)/build:/app/build \
		-v $(DATA_VOLUME)/scripts:/app/scripts \
		-v $(DATA_VOLUME)/src:/app/src \
		$(IMAGE):$(IMAGE_TAG)-dev \
		npx ts-node scripts/find-reviews-from-hypothesis q5X6RWJ6 | tee ./data/reviews/b560187e-f2fb-4ff9-a861-a204f3fc0fb0.csv

release:
	TAG=latest/$$(date +%Y%m%d%H%M); git tag $$TAG && git push origin $$TAG
