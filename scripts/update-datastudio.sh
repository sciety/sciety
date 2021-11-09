#!/bin/bash

set -euox pipefail

scripts=$(dirname $0)

CLOUDWATCH_EXPORT_ID=$($scripts/launch-cloud-watch-export.sh)

echo "CLOUDWATCH_EXPORT_ID: ${CLOUDWATCH_EXPORT_ID}"

$scripts/wait-for-cloud-watch-task-completion.sh $CLOUDWATCH_EXPORT_ID

$scripts/download-and-convert-cloudwatch-export.sh $CLOUDWATCH_EXPORT_ID
