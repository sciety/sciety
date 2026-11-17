#!/usr/bin/env bash
# Fetches Bonfire posts as ActivityPub objects, signing each request with an
# HTTP Signature (draft-cavage-http-signatures) as Sciety's production actor.
# bonfire.cafe rejects unsigned requests with 401.
#
# For each object the signing string, the response status and, for a 200, the
# object's key fields are written to stdout, and the full object is written to
# <output-dir>/<object-id>.json, replacing any earlier copy, as:
#   {"bonfireUrl": "<the url requested>", "object": {...the object, unchanged...}}
# A browser opening bonfireUrl is redirected to the post's page on Bonfire.
# Redirects are not followed: a new host needs a new signature, so the Location
# is printed instead.
#
# The private key is read from ACTIVITYPUB_PRIVATE_KEY, base64-encoded as the
# app expects it. It must be the key whose public key is served at
# https://sciety.org/activitypub/actor, because bonfire.cafe fetches that
# document to verify the signature. Check they match with:
#   printf '%s' "$ACTIVITYPUB_PRIVATE_KEY" | openssl base64 -d -A | openssl pkey -pubout
#   curl -s https://sciety.org/activitypub/actor | jq -r .publicKey.publicKeyPem
#
# Usage: ACTIVITYPUB_PRIVATE_KEY=... scripts/fetch-bonfire-activitypub-objects.sh [output-dir]
#   output-dir  where to write the objects (default data/bonfire-activitypub-objects)
#
# Environment variables:
#   ACTIVITYPUB_PRIVATE_KEY  base64-encoded PEM private key to sign with (required)
#   DELAY_SECONDS            pause between requests (default 1)
set -euo pipefail

output_dir=${1:-data/bonfire-activitypub-objects}
delay_seconds=${DELAY_SECONDS:-1}

user_agent='Sciety (http://sciety.org; mailto:team@sciety.org)'
key_id='https://sciety.org/activitypub/actor#main-key'
object_urls=(
  'https://bonfire.cafe/pub/objects/01M74PBFVRXXJ03A0QT56XFSWM'
  'https://bonfire.cafe/pub/objects/01M6ZWRSBGF4A8HGDDEBE8KNFG'
)

if [ -z "${ACTIVITYPUB_PRIVATE_KEY:-}" ]; then
  echo "ACTIVITYPUB_PRIVATE_KEY is not set" >&2
  exit 1
fi

response_body=$(mktemp)
response_headers=$(mktemp)
private_key_file=$(mktemp)
trap 'rm -f "$response_body" "$response_headers" "$private_key_file"' EXIT

# openssl signs from a file, so the decoded key is written to a temporary file
# that only the current user can read and that is removed on exit.
chmod 600 "$private_key_file"
# Whitespace is removed first, as the app's decoder ignores line-wrapped base64.
printf '%s' "$ACTIVITYPUB_PRIVATE_KEY" | tr -d ' \n\r' | openssl base64 -d -A > "$private_key_file"
if ! openssl pkey -in "$private_key_file" -noout 2>/dev/null; then
  echo "ACTIVITYPUB_PRIVATE_KEY could not be decoded as a base64-encoded PEM private key" >&2
  exit 1
fi

mkdir -p "$output_dir"

fetch_signed() {
  local url=$1
  local without_scheme=${url#https://}
  local host=${without_scheme%%/*}
  local path=/${without_scheme#*/}
  local date
  date=$(LC_ALL=C date -u '+%a, %d %b %Y %H:%M:%S GMT')

  # One line per signed header, in the same order as the headers list in the
  # Signature header, with no trailing newline.
  local signing_string
  signing_string=$(printf '(request-target): get %s\nhost: %s\ndate: %s' "$path" "$host" "$date")
  local signature
  signature=$(printf '%s' "$signing_string" | openssl dgst -sha256 -sign "$private_key_file" | openssl base64 -A)

  echo "=== GET $url"
  echo "--- signing string ---"
  echo "$signing_string"
  echo "----------------------"

  local status
  status=$(curl -s -g --max-time 30 -A "$user_agent" \
    -H "Host: $host" \
    -H "Date: $date" \
    -H 'Accept: application/activity+json' \
    -H "Signature: keyId=\"$key_id\",algorithm=\"rsa-sha256\",headers=\"(request-target) host date\",signature=\"$signature\"" \
    -D "$response_headers" -o "$response_body" -w '%{http_code}' "$url" || echo '000')
  echo "status: $status"

  case "$status" in
    200)
      local output_file="$output_dir/${url##*/}.json"
      if ! jq -e . "$response_body" > /dev/null 2>&1; then
        echo "response is not JSON, not saved: $(cat "$response_body")"
        return
      fi
      jq --arg bonfireUrl "$url" '{bonfireUrl: $bonfireUrl, object: .}' "$response_body" > "$output_file"
      jq '{id, type, url, attributedTo, published, content: (.content // "" | .[0:300])}' "$response_body"
      echo "saved to: $output_file"
      ;;
    3*)
      echo "redirect to: $(grep -i '^location:' "$response_headers" | tail -n 1 | cut -d' ' -f2- | tr -d '\r')"
      ;;
    *)
      echo "body: $(cat "$response_body")"
      ;;
  esac
  echo
}

for url in "${object_urls[@]}"; do
  fetch_signed "$url"
  sleep "$delay_seconds"
done
