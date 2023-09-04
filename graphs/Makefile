ARCH_DIAG := arch.svg
SRC_DIAG := modules.svg
WRITE_SIDE_DIAG := write-side.svg
TS_SOURCES := $(shell find ../src -name '*.ts')

.PHONY: all

all: $(ARCH_DIAG) $(SRC_DIAG) $(WRITE_SIDE_DIAG)

$(ARCH_DIAG): $(TS_SOURCES)
	npx depcruise --include-only src --collapse 3 --validate -T archi ../src \
	| docker run --interactive --rm risaacson/graphviz dot -Tsvg \
	> $@

$(SRC_DIAG): $(TS_SOURCES)
	npx depcruise --include-only src --validate -T dot ../src \
	| docker run --interactive --rm risaacson/graphviz dot -Tsvg \
	> $@

$(WRITE_SIDE_DIAG): $(TS_SOURCES)
	(cd ..; npx depcruise --config graphs/.dependency-cruiser.js --include-only 'src|test' --collapse 2 --reaches write-side -T archi src test) \
	| docker run --interactive --rm risaacson/graphviz dot -Tsvg \
	> $@

clean:
	rm -rf $(ARCH_DIAG) $(SRC_DIAG)
