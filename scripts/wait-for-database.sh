#!/bin/bash
set -e

timeout="60"

timeout --foreground "$timeout" bash << EOT
    while true; do
        echo "Waiting for database..."
        docker compose -f docker-compose.yml -f docker-compose.dev.yml exec -T db psql -c "SELECT 'database is responding'" sciety user 2> /dev/null && exit 0
        sleep 1
    done
EOT
