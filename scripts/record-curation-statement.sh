#! /bin/sh

evaluationLocator="$1"
articleId="$2"
groupId="$3"

curl -v localhost:8080/api/record-curation-statement \
  -H "Authorization: Bearer $SCIETY_TEAM_API_BEARER_TOKEN" \
  -X POST \
  -H "Content-type: application/json" \
  -d '{"articleId": "'$articleId'", "evaluationLocator": "'$evaluationLocator'", "groupId": "'$groupId'"}'

