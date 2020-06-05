DOCDIR := docs
DOCKER := docker
DATA_VOLUME := $(shell pwd)
IMAGE := liberoadmin/prc-frontend
IMAGE_TAG := local
PORT := 8080

.PHONY: build clean dev install lint* prod test

dev: export TARGET = dev
dev: install build
	$(DOCKER) run \
		-v $(DATA_VOLUME)/src:/app/src:ro \
		-v $(DATA_VOLUME)/static:/app/static:ro \
		-p $(PORT):80 \
		$(IMAGE):$(IMAGE_TAG)-dev

prod: export TARGET = prod
prod: build
	$(DOCKER) run \
		-p $(PORT):80 \
		$(IMAGE):$(IMAGE_TAG)

lint: export TARGET = dev
lint: build
	$(DOCKER) run --rm \
		-v $(DATA_VOLUME)/.eslint:/app/.eslint \
		$(IMAGE):$(IMAGE_TAG)-dev \
		npm run lint

lint\:fix: export TARGET = dev
lint\:fix: build
	$(DOCKER) run --rm \
		-v $(DATA_VOLUME)/.eslint:/app/.eslint \
		-v $(DATA_VOLUME)/src:/app/src \
		-v $(DATA_VOLUME)/test:/app/test \
		$(IMAGE):$(IMAGE_TAG)-dev \
		npm run lint:fix

test: export TARGET = dev
test: build
	$(DOCKER) run \
		--env DEBUG=-* \
		-v $(DATA_VOLUME)/.jest:/app/.jest \
		$(IMAGE):$(IMAGE_TAG)-dev \
		npm run test

build:
	@if [ "$(TARGET)" != prod ]; then \
		image_tag_suffix=-dev; \
	fi; \
	$(DOCKER) build -t $(IMAGE):$(IMAGE_TAG)$${image_tag_suffix} . --target $(TARGET)

deps: $(DOCDIR)/folders.png $(DOCDIR)/modules.png

$(DOCDIR)/folders.png: $(DOCDIR) install
	npx depcruise --include-only "^src" --validate -T archi src | dot -Tpng > $@

$(DOCDIR)/modules.png: $(DOCDIR) install
	npx depcruise --include-only "^src" --validate -T dot src | dot -Tpng > $@

$(DOCDIR):
	mkdir -p $(DOCDIR)

install: node_modules

node_modules: package.json package-lock.json
	npm install
	touch node_modules

clean:
	rm -rf .eslint .jest build node_modules
