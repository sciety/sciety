#!/usr/bin/env bash
set -e

function finish() {
  echo "Stopping $container"
  docker logs "$container"
  docker stop "$container"
}

trap finish EXIT

container=$(docker run -d "liberoadmin/prc-frontend:${IMAGE_TAG:-local}")

timeout --foreground 10 bash << EOT
  while true; do
    current=\$(docker inspect "${container}" | jq -r '.[0].State.Health.Status')
    echo "${container} is in state: \${current}"
    if [ "\$current" == "healthy" ]; then
        break
    fi
    sleep 1
  done
EOT
