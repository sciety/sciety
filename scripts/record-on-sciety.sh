#! /bin/sh

curl https://staging.sciety.org/api/record-curation-statement \
  -w "%{http_code}," \
  -H "Authorization: Bearer $SCIETY_TEAM_API_BEARER_TOKEN" \
  -X POST \
  -H "Content-type: application/json" \
  -d '{"evaluationLocator": "'$1'", "articleId": "'$2'", "groupId": "'$3'"}'

