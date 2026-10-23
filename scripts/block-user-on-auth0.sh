#!/bin/sh

curl -L -g -X PATCH 'https://sciety-staging.eu.auth0.com/api/v2/users/:id' \
-H "Authorization: Bearer $SECRET" \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
--data-raw '{"blocked":true}'