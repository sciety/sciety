#!/usr/bin/env bash

set -euo pipefail

fast_test_count=$(grep --recursive '.skip\|.failing' test | wc -l)
echo "> Fast test files with WIP"
grep --recursive --files-with-matches '.skip\|.failing' test

feature_test_count=$(grep --recursive '.skip\|.failing' feature-test | wc -l)
printf "\n> Feature test files with WIP\n"
grep --recursive --files-with-matches '.skip\|.failing' feature-test

printf "\nskipped or failing fast tests: %s\n" $fast_test_count
printf "skipped or failing feature tests: %s\n" $feature_test_count
