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

unused\:exports: export TARGET = dev
unused\:exports: build
	$(DOCKER) run --rm -t \
		-v $(DATA_VOLUME)/.eslint:/app/.eslint \
		-v $(DATA_VOLUME)/build:/app/build \
		$(IMAGE):$(IMAGE_TAG)-dev \
		npm run unused:exports

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
		npx ts-node scripts/find-elife-endorsements

release:
	TAG=latest/$$(date +%Y%m%d%H%M); git tag $$TAG && git push origin $$TAG
