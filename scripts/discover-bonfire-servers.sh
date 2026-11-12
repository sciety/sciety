#!/usr/bin/env bash
# Discovers public Bonfire (https://bonfirenetworks.org) servers, the
# ActivityPub instances that might carry mentions of articles, and writes
# them to a JSON file, sorted by domain:
#   [
#     {
#       "domain": "bonfire.cafe",
#       "version": "1.1.0",
#       "openRegistrations": true,
#       "users": 123,
#       "nodeinfo": "https://bonfire.cafe/.well-known/nodeinfo/2.1"
#     },
#     ...
#   ]
#
# Candidate domains come from FediDB's directory of servers running Bonfire.
# Each candidate is then checked against its own NodeInfo document, and only
# servers that answer publicly and report their software as bonfire are
# written. Candidates that are unreachable or run other software are listed
# on stderr and left out.
#
# An existing output file is replaced. The file is never written as an empty
# list: if FediDB cannot be reached, lists no Bonfire servers, or none of its
# candidates can be confirmed, the script exits with an error before writing,
# leaving any existing file as it is.
#
# Usage: scripts/discover-bonfire-servers.sh [output-file]
#   output-file  where to write the servers (default data/bonfire-servers.json)
#
# Environment variables:
#   DELAY_SECONDS  pause between requests (default 1)
set -euo pipefail

output_file=${1:-data/bonfire-servers.json}
delay_seconds=${DELAY_SECONDS:-1}

user_agent='Sciety (http://sciety.org; mailto:team@sciety.org)'
fedidb_url='https://api.fedidb.org/v1/servers?software=bonfire&limit=40'
max_attempts=5

response_body=$(mktemp)
response_headers=$(mktemp)
candidates=$(mktemp)
servers=$(mktemp)
trap 'rm -f "$response_body" "$response_headers" "$candidates" "$servers"' EXIT

# Fetches a URL into $response_body, following redirects and retrying on rate
# limits and server errors. Returns non-zero if no 200 response was received.
fetch() {
  local url=$1
  local attempt=1
  local backoff_seconds=5
  while true; do
    local status
    status=$(curl -s -L -g --max-time 30 -A "$user_agent" -H 'Accept: application/json' \
      -D "$response_headers" -o "$response_body" -w '%{http_code}' "$url" || echo '000')

    if [ "$status" = '200' ]; then
      return 0
    fi

    if [ "$attempt" -ge "$max_attempts" ]; then
      echo "Giving up on $url after $attempt attempts (last status $status)" >&2
      return 1
    fi

    case "$status" in
      429|5*)
        local retry_after
        retry_after=$(grep -i '^retry-after:' "$response_headers" | tail -n 1 | tr -dc '0-9' || true)
        local wait_seconds=${retry_after:-$backoff_seconds}
        echo "Status $status from $url, waiting ${wait_seconds}s before retry $attempt/$((max_attempts - 1))" >&2
        sleep "$wait_seconds"
        backoff_seconds=$((backoff_seconds * 2))
        attempt=$((attempt + 1))
        ;;
      *)
        # Unreachable hosts (000) and client errors are not retried: a dead
        # server would otherwise cost minutes of back-off.
        echo "Status $status from $url, not retrying" >&2
        return 1
        ;;
    esac
  done
}

# Collect candidate domains from FediDB, following its cursor pagination.
url=$fedidb_url
page=0
while [ -n "$url" ]; do
  page=$((page + 1))
  fetch "$url"
  jq -r '.data[].domain' "$response_body" >> "$candidates"
  next_cursor=$(jq -r '.meta.next_cursor // empty' "$response_body")
  echo "FediDB page $page: $(jq '.data | length' "$response_body") servers" >&2
  if [ -n "$next_cursor" ]; then
    url="$fedidb_url&cursor=$next_cursor"
    sleep "$delay_seconds"
  else
    url=''
  fi
done

sort -u -o "$candidates" "$candidates"
if [ ! -s "$candidates" ]; then
  echo "FediDB listed no Bonfire servers, leaving $output_file unchanged" >&2
  exit 1
fi
echo "Checking NodeInfo for $(wc -l < "$candidates" | tr -d ' ') candidate domains" >&2

found=0
skipped=0
while read -r domain; do
  [ -n "$domain" ] || continue
  sleep "$delay_seconds"

  if ! fetch "https://$domain/.well-known/nodeinfo"; then
    echo "Skipping $domain: no NodeInfo discovery document" >&2
    skipped=$((skipped + 1))
    continue
  fi
  # Prefer the newest NodeInfo schema the server advertises.
  nodeinfo_url=$(jq -r '[.links[]? | select(.rel | test("^https?://nodeinfo\\.diaspora\\.software/ns/schema/")) ] | sort_by(.rel) | last | .href // empty' "$response_body" 2>/dev/null || true)
  if [ -z "$nodeinfo_url" ]; then
    echo "Skipping $domain: NodeInfo discovery document has no schema link" >&2
    skipped=$((skipped + 1))
    continue
  fi

  if ! fetch "$nodeinfo_url"; then
    echo "Skipping $domain: could not fetch $nodeinfo_url" >&2
    skipped=$((skipped + 1))
    continue
  fi
  software=$(jq -r '.software.name // empty | ascii_downcase' "$response_body" 2>/dev/null || true)
  if [ "$software" != 'bonfire' ]; then
    echo "Skipping $domain: NodeInfo reports software '${software:-unknown}'" >&2
    skipped=$((skipped + 1))
    continue
  fi

  jq -c --arg domain "$domain" --arg nodeinfo "$nodeinfo_url" '{
    domain: $domain,
    version: .software.version,
    openRegistrations: .openRegistrations,
    users: .usage.users.total,
    nodeinfo: $nodeinfo
  }' "$response_body" >> "$servers"
  found=$((found + 1))
  echo "Found $domain" >&2
done < "$candidates"

# Never replace the file with an empty list: no confirmed servers at all is far
# more likely to mean a network problem than that every server has gone.
if [ ! -s "$servers" ]; then
  echo "No candidate could be confirmed as a Bonfire server ($skipped skipped), leaving $output_file unchanged" >&2
  exit 1
fi

jq -s 'sort_by(.domain)' "$servers" > "$output_file.tmp"
mv "$output_file.tmp" "$output_file"
echo "Wrote $found Bonfire servers to $output_file ($skipped candidates skipped)" >&2
