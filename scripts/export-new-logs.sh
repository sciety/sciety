#!/bin/bash

set -euo pipefail

from=$(bq query --format=prettyjson --use_legacy_sql=false 'SELECT DATE_ADD(DATE(MAX(request_timestamp)), INTERVAL 1 DAY) AS day_from FROM `elife-data-pipeline.de_proto.v_sciety_ingress`' | jq -r '.[0].day_from')
echo "Exporting from $from"
