#! /bin/sh

curl "https://api.hypothes.is/api/search?user=public_reviews;tag=Summary" | \
  jq -r '.rows | .[] | "hypothesis:" + (.id) + " " + (.uri)' | \
  grep 10.1101 | \
  sed -e 's/https.*content\///' | \
  sed -e 's/v[0-9]*$//'

