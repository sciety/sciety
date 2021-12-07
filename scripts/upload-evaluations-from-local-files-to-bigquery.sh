#!/bin/bash

set -euo pipefail

temp_jsonl_fn="./temp-evaluations.jsonl"
echo -n > "${temp_jsonl_fn}"
for json_fn in ./data/reviews/*; do
    group_id="$(basename "${json_fn}" .jsonl)"
    echo "group_id: ${group_id}"
    cat "${json_fn}" \
        | jq --compact-output \
            '. += {"group_id": "'${group_id}'"}' \
        >> "${temp_jsonl_fn}"
done

bq load \
    --project_id=elife-data-pipeline \
    --autodetect \
    --replace \
    --source_format=NEWLINE_DELIMITED_JSON \
    de_proto.sciety_evaluations_v1 \
    "${temp_jsonl_fn}"
