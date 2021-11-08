#!/bin/bash

set -euo pipefail

cloudWatchTaskId=$1

timeout="1800"

timeout --foreground "$timeout" bash << EOT
    while true; do
      taskStatus=$(aws logs describe-export-tasks --task-id=$cloudWatchTaskId \
        | jq -r '.exportTasks[0].status.code')
      echo \$taskStatus
      if [[ \$taskStatus == COMPLETED ]]; then
       break
      fi
      if [[ \$taskStatus == FAILED ]]; then
       exit 1
      fi
      sleep 30
    done
EOT
