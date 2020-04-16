DOCKER := docker
DATA_VOLUME := $(shell pwd)
IMAGE_TAG := liberoadmin/prc-frontend:local

.PHONY: build start

start: build
	$(DOCKER) run -v $(DATA_VOLUME)/static:/usr/share/nginx/html:ro -p 8080:80 $(IMAGE_TAG)

build:
	$(DOCKER) build -t $(IMAGE_TAG) .

clean:

clobber: clean

