#! /bin/sh

evaluationLocator="hypothesis:$1"

articleId=`cat ./data/exploratory-test-from-prod.csv | \
  fgrep "$1" | \
  cut -d: -f7 | sed -e 's/".*//'`

curl -v localhost:8080/api/record-curation-statement \
  -H "Authorization: Bearer secret" \
  -X POST \
  -H "Content-type: application/json" \
  -d '{"articleId": "'$articleId'", "evaluationLocator": "'$evaluationLocator'", "groupId": "4bbf0c12-629b-4bb8-91d6-974f4df8efb2"}'

