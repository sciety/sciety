#!/usr/bin/env bash
set -e

function finish() {
  echo "Stopping all containers"
  docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs
  docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
}

trap finish EXIT

export IMAGE=sciety/sciety
export IMAGE_TAG="${IMAGE_TAG:-local}"

docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
container=sciety_app

timeout --foreground 20 bash << EOT
  while true; do
    current=\$(docker inspect "${container}" | jq -r '.[0].State.Health.Status')
    echo "${container} is in state: \${current}"
    if [ "\$current" == "healthy" ]; then
        break
    fi
    sleep 1
  done
EOT
