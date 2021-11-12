#!/bin/bash

set -euo pipefail

if ! command -v gdate &> /dev/null
then
    DATE=date
else
    DATE=gdate
fi


from=$(bq query --format=prettyjson --use_legacy_sql=false 'SELECT DATE_ADD(DATE(MAX(request_timestamp)), INTERVAL 1 DAY) AS day_from FROM `elife-data-pipeline.de_proto.v_sciety_ingress`' | jq -r '.[0].day_from')
to=$($DATE '+%Y-%m-%d')

>&2 echo "Exporting from $from 00:00 to $to 00:00"
from_epoch_ms="$($DATE --date "$from 00:00:00 +0000" +%s)000"
to_epoch_ms="$($DATE --date "$to 00:00:00 +0000" +%s)000"

cloudWatchTaskId=$(aws logs create-export-task \
	--log-group-name '/aws/containerinsights/libero-eks--franklin/application' \
 	--log-stream-name-prefix 'ingress-nginx-controller-' \
 	--from  $from_epoch_ms \
 	--to  $to_epoch_ms \
 	--destination 'sciety-data-extractions' \
 	--destination-prefix "ingress-nginx-controller-$from-$to" \
     | jq -r '.taskId')
echo $cloudWatchTaskId
