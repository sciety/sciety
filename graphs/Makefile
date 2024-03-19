CONFIG := .dependency-cruiser.js
ARCH_DIAG := arch.svg
SRC_DIAG := modules.svg
TS_SOURCES := $(shell find ../src -name '*.ts')

.PHONY: all

all: $(ARCH_DIAG) $(SRC_DIAG)

$(ARCH_DIAG): $(TS_SOURCES) $(CONFIG)
	npx depcruise --include-only src --collapse 3 --validate -T archi -- ../src \
	| docker run --interactive --rm risaacson/graphviz dot -Tsvg \
	> $@

$(SRC_DIAG): $(TS_SOURCES) $(CONFIG)
	npx depcruise --include-only src --validate -T dot -F write-side --collapse 4 -- ../src \
	| docker run --interactive --rm risaacson/graphviz dot -Tsvg \
	> $@

clean:
	rm -rf $(ARCH_DIAG) $(SRC_DIAG)
