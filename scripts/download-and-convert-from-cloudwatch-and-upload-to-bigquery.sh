#!/bin/bash

set -euo pipefail

from=$(bq query --format=prettyjson --use_legacy_sql=false 'SELECT DATE_ADD(DATE(MAX(request_timestamp)), INTERVAL 1 DAY) AS day_from FROM `elife-data-pipeline.de_proto.v_sciety_ingress`' | jq -r '.[0].day_from')
to=$(date '+%Y-%m-%d')

cloudWatchTaskId=$1

logsUri="s3://sciety-data-extractions/ingress-nginx-controller-$from-$to/$cloudWatchTaskId"
echo $logsUri

rm -rf logs
mkdir logs
aws s3 cp --recursive $logsUri ./logs
gunzip -r logs
find logs -type 'f' | grep -v jsonl | xargs -n 1 ./scripts/convert-cloudwatch-logs-to-bigquery-jsonl.sh
(find logs -type 'f' | grep jsonl | xargs cat) > logs/singlefile.bq

bq load \
    --project_id=elife-data-pipeline \
    --autodetect \
    --source_format=NEWLINE_DELIMITED_JSON \
    de_proto.sciety_ingress_v1 \
    logs/singlefile.bq
