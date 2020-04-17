DOCKER := docker
DATA_VOLUME := $(shell pwd)
IMAGE := liberoadmin/prc-frontend
IMAGE_TAG := local

.PHONY: build dev install prod

dev: export TARGET = dev
dev: install build
	$(DOCKER) run -v $(DATA_VOLUME)/static:/app/static:ro -p 8080:80 $(IMAGE):$(IMAGE_TAG)

prod: export TARGET = prod
prod: build
	$(DOCKER) run -p 8080:80 $(IMAGE):$(IMAGE_TAG)

build:
	$(DOCKER) build -t $(IMAGE):$(IMAGE_TAG) . --target $(TARGET)

install: node_modules

node_modules: package.json package-lock.json
	npm install
	touch node_modules
