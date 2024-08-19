#! /bin/sh

curl -v -X POST "https://coar-notify-inbox.fly.dev/inbox/" \
 -H "Content-Type: application/json" \
 -d @example-coar-payload.json
