#!/usr/bin/env bash
# Walks Semble's global feed of CARD_COLLECTED activities and writes every card
# whose cardContent has a doi field, and writes the set of distinct cardContent
# url and doi pairs to a JSON Lines file:
#   {"url": "...", "doi": "..."}
#
# The first line of the file records how far back the feed has been fetched:
#   {"cutoff": "2026-11-11T11:03:52.000Z"}
# The feed is newest first, so when the file has a cutoff the walk stops at the
# first page holding an activity created before it, rather than walking the
# whole feed. Without a cutoff line the whole feed is walked. Pairs are merged
# into the existing file and deduplicated, so overlap with earlier runs is
# harmless.
#
# The cutoff is moved forward to the newest activity seen only after a run
# that started at the top of the feed and reached the cutoff (or the end of the
# feed). A run stopped by max-pages, or one resumed with START_CURSOR, keeps
# the old cutoff, so no gap is left behind.
#
# Usage: scripts/fetch-semble-cards-with-doi.sh [max-pages] [output-file]
#   max-pages    stop after this many pages, 0 for no limit (default 0)
#   output-file  where to write the pairs (default data/semble-cards-with-doi.jsonl);
#                if it already exists, new pairs are merged into it
#
# Environment variables:
#   DELAY_SECONDS  pause between requests (default 1)
#   START_CURSOR   activity id to resume from, as printed in the progress output
set -euo pipefail

max_pages=${1:-0}
output_file=${2:-data/semble-cards-with-doi.jsonl}
delay_seconds=${DELAY_SECONDS:-1}
cursor=${START_CURSOR:-}

if ! [[ "$max_pages" =~ ^[0-9]+$ ]]; then
  echo "max-pages must be a whole number, got '$max_pages'" >&2
  exit 1
fi

# Converts an ISO 8601 UTC timestamp, with or without fractional seconds, to
# epoch seconds; fractions are dropped, so comparisons are to the second.
jq_defs='def ts: sub("\\.[0-9]+Z$"; "Z") | fromdateiso8601;'

cutoff=''
if [ -f "$output_file" ]; then
  cutoff=$(jq -r -s 'map(select(type == "object" and has("cutoff")) | .cutoff) | first // empty' "$output_file")
  if [ -n "$cutoff" ]; then
    # Fail now rather than after fetching if the stored cutoff is not a timestamp.
    jq -n --arg cutoff "$cutoff" "$jq_defs"' $cutoff | ts' > /dev/null
    echo "Fetching activities back to the cutoff $cutoff" >&2
  else
    echo "No cutoff in $output_file, walking the whole feed" >&2
  fi
fi

base_url='https://api.semble.so/xrpc/network.cosmik.feed.getGlobal?limit=100&activityTypes[]=CARD_COLLECTED'
user_agent='Sciety (http://sciety.org; mailto:team@sciety.org)'
max_attempts=5

response_body=$(mktemp)
response_headers=$(mktemp)
raw_output=$(mktemp)
merged_output=$(mktemp)
trap 'rm -f "$response_body" "$response_headers" "$raw_output" "$merged_output"' EXIT

fetch_page() {
  local url=$base_url
  if [ -n "$cursor" ]; then
    url="$url&beforeActivityId=$cursor"
  fi

  local attempt=1
  local backoff_seconds=5
  while true; do
    local status
    status=$(curl -s -g --max-time 30 -A "$user_agent" \
      -D "$response_headers" -o "$response_body" -w '%{http_code}' "$url" || echo '000')

    if [ "$status" = '200' ]; then
      return 0
    fi

    if [ "$attempt" -ge "$max_attempts" ]; then
      echo "Giving up after $attempt attempts (last status $status). Resume with START_CURSOR=$cursor" >&2
      return 1
    fi

    case "$status" in
      429|5*|000)
        local retry_after
        retry_after=$(grep -i '^retry-after:' "$response_headers" | tr -dc '0-9' || true)
        local wait_seconds=${retry_after:-$backoff_seconds}
        echo "Status $status, waiting ${wait_seconds}s before retry $attempt/$((max_attempts - 1))" >&2
        sleep "$wait_seconds"
        backoff_seconds=$((backoff_seconds * 2))
        attempt=$((attempt + 1))
        ;;
      *)
        echo "Unexpected status $status, not retrying. Resume with START_CURSOR=$cursor" >&2
        return 1
        ;;
    esac
  done
}

started_at_top=false
if [ -z "$cursor" ]; then
  started_at_top=true
fi

page=0
total_activities=0
newest_seen=''
run_complete=false
while true; do
  page=$((page + 1))
  fetch_page

  jq -c '.activities[] | select((.card.cardContent.doi // "") != "") | { url: .card.cardContent.url, doi: .card.cardContent.doi }' "$response_body" >> "$raw_output"

  if [ "$page" -eq 1 ]; then
    newest_seen=$(jq -r "$jq_defs"' [.activities[].createdAt] | if length == 0 then empty else max_by(ts) end' "$response_body")
  fi

  reached_cutoff=false
  if [ -n "$cutoff" ]; then
    reached_cutoff=$(jq -r --arg cutoff "$cutoff" "$jq_defs"' ($cutoff | ts) as $c | any(.activities[]; (.createdAt | ts) < $c)' "$response_body")
  fi

  activities_on_page=$(jq '.activities | length' "$response_body")
  total_activities=$((total_activities + activities_on_page))
  has_more=$(jq -r '.pagination.hasMore' "$response_body")
  next_cursor=$(jq -r '.pagination.nextCursor // empty' "$response_body")

  echo "Page $page: $activities_on_page activities, $(wc -l < "$raw_output" | tr -d ' ') cards with a doi so far, next cursor ${next_cursor:-none}" >&2

  if [ "$reached_cutoff" = 'true' ]; then
    echo "Reached activities older than the cutoff $cutoff" >&2
    run_complete=true
    break
  fi
  if [ "$has_more" != 'true' ] || [ -z "$next_cursor" ] || [ "$next_cursor" = "$cursor" ]; then
    run_complete=true
    break
  fi
  if [ "$max_pages" -gt 0 ] && [ "$page" -ge "$max_pages" ]; then
    echo "Stopping after $max_pages pages. Resume with START_CURSOR=$next_cursor" >&2
    break
  fi

  cursor=$next_cursor
  sleep "$delay_seconds"
done

new_cutoff=$cutoff
if [ "$run_complete" = 'true' ] && [ "$started_at_top" = 'true' ] && [ -n "$newest_seen" ]; then
  new_cutoff=$newest_seen
else
  echo "Run did not cover the feed from the top to the cutoff, keeping the cutoff ${cutoff:-(none)}" >&2
fi

{
  if [ -n "$new_cutoff" ]; then
    jq -c -n --arg cutoff "$new_cutoff" '{ cutoff: $cutoff }'
  fi
  {
    if [ -f "$output_file" ]; then
      jq -c 'select((type == "object" and has("cutoff")) | not)' "$output_file"
    fi
    cat "$raw_output"
  } | jq -c -s 'unique[]'
} > "$merged_output"
mv "$merged_output" "$output_file"
pair_count=$(jq -s 'map(select((type == "object" and has("cutoff")) | not)) | length' "$output_file")
echo "Scanned $total_activities activities across $page pages; wrote $pair_count distinct url and doi pairs and the cutoff ${new_cutoff:-(none)} to $output_file" >&2
