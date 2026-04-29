#!/bin/sh

cat "$1" | xargs -I{} curl -L -g -X PATCH 'https://sciety.eu.auth0.com/api/v2/users/{}' \
-H "Authorization: Bearer $secret" \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
--data-raw '{"blocked":true}'
