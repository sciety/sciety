#!/bin/bash

set -euo pipefail

cat $1 \
    | sed -e 's/[^ ]* //' \
    | jq --compact-output 'del(.kubernetes) | del(.docker) | del(.app_upstream_response_time)' \
    > $1.jsonl
