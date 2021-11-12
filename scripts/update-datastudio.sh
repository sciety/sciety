#!/bin/bash

set -euox pipefail

scripts=$(dirname $0)

cloudWatchTaskId=$($scripts/launch-cloud-watch-export.sh)

echo "cloudWatchTaskId: ${cloudWatchTaskId}"

$scripts/wait-for-cloud-watch-task-completion.sh $cloudWatchTaskId

$scripts/download-and-convert-from-cloudwatch-and-upload-to-bigquery.sh $cloudWatchTaskId

echo "See https://datastudio.google.com/reporting/bc7fa747-9d10-4272-836d-f40425b93c95"
