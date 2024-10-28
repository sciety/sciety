#!/usr/bin/env bash

set -euo pipefail

fast_test_count=$(grep --recursive '.skip\|.failing' test | wc -l)
echo "> Fast test files with WIP"
grep --recursive --files-with-matches '.skip\|.failing' test

feature_test_count=$(grep --recursive '.skip\|.failing' feature-test | wc -l)
printf "\n> Feature test files with WIP\n"
grep --recursive --files-with-matches '.skip\|.failing' feature-test

feature_flags=$(grep --recursive 'EXPERIMENT_ENABLED ===' src | wc -l)
printf "\n> Files with feature flags\n"
grep --recursive --files-with-matches 'EXPERIMENT_ENABLED ===' src

uuids=$(grep -rE "'[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}'" src | grep -v 'style-guide' | wc -l)
printf "\n> Files with hardcoded UUIDs\n"
grep -rEl "'[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}'" src | grep -v 'style-guide'

printf "\n> Use of deprecated code\n"
npx eslint src --ext .ts --plugin "deprecation" --rule "deprecation/deprecation:error" --cache --cache-location .eslint/wip || true

printf "\nSkipped or failing fast tests: %s\n" $fast_test_count
printf "Skipped or failing feature tests: %s\n" $feature_test_count
printf "Feature flags: %s\n" $feature_flags
printf "Hardcoded UUIDs: %s\n" $uuids
