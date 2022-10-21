#!/bin/bash
set -e

timeout="60"

timeout --foreground "$timeout" bash << EOT
    while true; do
        status=\$(docker inspect sciety_db | jq -r .[0].State.Health.Status)
        echo \$status
        if [ \$status == "healthy" ]; then
            exit 0;
        fi
        sleep 1
    done
EOT
