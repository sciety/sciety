#!/bin/sh

while IFS= read -r user_id; do
  curl -L -g -X PATCH "https://sciety.eu.auth0.com/api/v2/users/${user_id}" \
  -H "Authorization: Bearer secret" \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  --data-raw '{"blocked":true}'
  sleep 0.5
done < "$1"
