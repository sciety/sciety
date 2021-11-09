#!/bin/bash

set -euo pipefail

CLOUDWATCH_EXPORT_ID=$(scripts/launch-cloud-watch-export.sh)

echo "CLOUDWATCH_EXPORT_ID: ${CLOUDWATCH_EXPORT_ID}"
