#!/bin/bash

set -euo pipefail

cat $1 \
    | grep -o -P '{.*' \
    | jq --compact-output 'del(.kubernetes) | del(.docker) | del(.app_upstream_response_time)' \
    > $1.jsonl
