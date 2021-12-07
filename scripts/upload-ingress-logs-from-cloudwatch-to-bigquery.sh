#!/bin/bash

set -euo pipefail

scripts=$(dirname $0)

cloudWatchTaskId=$($scripts/launch-cloud-watch-export.sh)

if [ -z "${cloudWatchTaskId}" ]; then
    # skipping an empty cloudwatch export (launch script will log message)
    exit 0
fi

echo "cloudWatchTaskId: ${cloudWatchTaskId}"

$scripts/wait-for-cloud-watch-task-completion.sh $cloudWatchTaskId

$scripts/download-and-convert-from-cloudwatch-and-upload-to-bigquery.sh $cloudWatchTaskId

echo "See https://datastudio.google.com/reporting/bc7fa747-9d10-4272-836d-f40425b93c95"
