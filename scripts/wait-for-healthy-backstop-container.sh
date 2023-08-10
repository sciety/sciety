#!/bin/bash
set -e

timeout="60"

timeout --foreground "$timeout" bash << EOT
    while true; do
        curl localhost:8081/ping 2> /dev/null && exit 0
        sleep 1
    done
EOT
