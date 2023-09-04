ARCH_DIAG := arch.svg
SRC_DIAG := modules.svg
WRITE_SIDE_DIAG := write-side.svg
TS_SOURCES := $(shell find ../src -name '*.ts')
TS_TESTS := $(shell find ../test -name '*.ts')

dot := docker run --interactive --rm risaacson/graphviz dot

.PHONY: all

all: $(ARCH_DIAG) $(SRC_DIAG) $(WRITE_SIDE_DIAG)

$(ARCH_DIAG): $(TS_SOURCES)
	npx depcruise --include-only src --collapse 3 --validate -T archi ../src \
	| $(dot) -Tsvg \
	> $@

$(SRC_DIAG): $(TS_SOURCES)
	npx depcruise --include-only src --validate -T dot ../src \
	| $(dot) -Tsvg \
	> $@

$(WRITE_SIDE_DIAG): $(TS_SOURCES) $(TS_TESTS)
	(cd ..; npx depcruise --config graphs/.dependency-cruiser.js --include-only 'src|test' --collapse 2 --reaches write-side -T archi src test) \
	| $(dot) -Tsvg \
	> $@

clean:
	rm -rf *.svg
