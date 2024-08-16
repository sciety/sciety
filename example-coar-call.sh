#! /bin/sh

curl -v -X POST "https://coar-notify-inbox.fly.dev/inbox" \
 --location -H "Content-Type: application/json" \
 --data-binary "@example-coar-payload.json"