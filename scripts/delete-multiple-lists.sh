#!/bin/sh
cat "$1" | xargs -I{} curl -X DELETE -H "Authorization: Bearer secret" -H "Content-Type: application/json" http://localhost:8080/api/lists/{}
