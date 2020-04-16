DOCKER := docker
DATA_VOLUME := $(shell pwd)
IMAGE := liberoadmin/prc-frontend
IMAGE_TAG := local

.PHONY: build start

start: build
	$(DOCKER) run -v $(DATA_VOLUME)/static:/usr/share/nginx/html:ro -p 8080:80 $(IMAGE):$(IMAGE_TAG)

build:
	$(DOCKER) build -t $(IMAGE):$(IMAGE_TAG) .

clean:

clobber: clean

