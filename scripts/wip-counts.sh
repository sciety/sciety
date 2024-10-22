#!/usr/bin/env bash

set -euo pipefail

fast_test_count=$(grep --recursive '.skip\|.failing' test | wc -l)
echo "> Fast test files with WIP"
grep --recursive --files-with-matches '.skip\|.failing' test

printf "\nskipped or failing fast tests: %s\n" $fast_test_count
