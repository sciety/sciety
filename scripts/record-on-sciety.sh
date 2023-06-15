#! /bin/sh

curl localhost:8080/api/record-curation-statement \
  -w "%{http_code}," \
  -H "Authorization: Bearer secret" \
  -X POST \
  -H "Content-type: application/json" \
  -d '{"evaluationLocator": "'$1'", "articleId": "'$2'", "groupId": "'$3'"}'

