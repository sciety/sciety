TS_SOURCES := $(shell find ../src -name '*.ts')

.PHONY: all

all: folders.svg modules.svg

folders.svg: $(TS_SOURCES)
	npx depcruise --include-only src --validate -T archi ../src \
	| docker run --interactive --rm risaacson/graphviz dot -Tsvg \
	> $@

modules.svg: $(TS_SOURCES)
	npx depcruise --include-only src --collapse 3 --validate -T dot ../src \
	| docker run --interactive --rm risaacson/graphviz dot -Tsvg \
	> $@

clean:
	rm -rf folders.svg modules.svg
