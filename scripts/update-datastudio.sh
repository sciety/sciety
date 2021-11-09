#!/bin/bash

set -euo pipefail

scripts=$(dirname $0)

CLOUDWATCH_EXPORT_ID=$($scripts/launch-cloud-watch-export.sh)

echo "CLOUDWATCH_EXPORT_ID: ${CLOUDWATCH_EXPORT_ID}"

$scripts/wait-for-cloud-watch-task-completion.sh $CLOUDWATCH_EXPORT_ID
