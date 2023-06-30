#! /bin/sh

for offset in 0; do
  curl "https://api.hypothes.is/api/search?group=q5X6RWJ6;sort=created;order=asc;limit=200;offset=$offset" | \
    jq -r '.rows | .[] | "hypothesis:" + (.id) + " " + (.tags)' 
done

