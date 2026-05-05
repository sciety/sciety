#!/bin/sh

while IFS= read -r list_id; do
  curl -X DELETE \
  -H "Authorization: Bearer $2" \
  -H "Content-Type: application/json" \
  https://sciety.org/api/lists/${list_id}
  sleep 0.5
done < "$1"
