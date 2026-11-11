#!/usr/bin/env bash
# Keeps only the lines of a JSON Lines file whose doi property starts with a
# supported DOI prefix, and writes them to a separate file. The input file is
# never modified.
#
# If the output file already exists, kept pairs it does not already contain
# (compared by url and doi) are appended to it; existing lines, including any
# edited or removed by hand, are left as they are. The {"cutoff": "..."} line
# written by scripts/fetch-semble-cards-with-doi.sh is ignored.
#
# The supported prefixes are copied from the startOfDoi values in
# src/ingest/legacy/expression-doi-from-uri-config.ts; keep them in sync by
# hand, except arXiv (10.48550/arXiv.), which is left out on purpose: arXiv
# DOIs are registered with DataCite, not Crossref, so Sciety can ingest
# evaluations of them but cannot render the papers. DOIs are compared
# case-insensitively, e.g. 10.1590/scielopreprints.1 matches
# 10.1590/SciELOPreprints.
#
# Usage: scripts/filter-semble-cards-for-supported-dois.sh input-file [output-file]
#   input-file   JSON Lines file, one object with a doi property per line
#   output-file  where to write the kept lines
#                (default <input-file without -with-doi.jsonl or .jsonl>-with-sciety-supported-dois.jsonl,
#                e.g. semble-cards-with-doi.jsonl -> semble-cards-with-sciety-supported-dois.jsonl);
#                if it already exists, new pairs are appended to it
set -euo pipefail

starts_of_doi=(
  '10.1101/'
  '10.1590/SciELOPreprints.'
  '10.21203/rs.3.rs-'
  '10.31219/osf.io/'
  '10.31234/osf.io/'
  '10.64898/'
)

input_file=${1:-}
if [[ -z "$input_file" ]]; then
  echo "Usage: $0 input-file [output-file]" >&2
  exit 1
fi
if [[ ! -f "$input_file" ]]; then
  echo "Input file not found: $input_file" >&2
  exit 1
fi

input_base=${input_file%.jsonl}
input_base=${input_base%-with-doi}
output_file=${2:-"${input_base}-with-sciety-supported-dois.jsonl"}
if [[ -e "$output_file" && "$output_file" -ef "$input_file" ]]; then
  echo "Output file must not be the input file: $output_file" >&2
  exit 1
fi

kept_output=$(mktemp)
trap 'rm -f "$kept_output"' EXIT

echo "Supported starts of DOI:" >&2
printf '  %s\n' "${starts_of_doi[@]}" >&2

# Lines that are not valid JSON, and the cutoff line, are dropped rather than
# stopping the script.
jq -c -R --argjson starts "$(printf '%s\n' "${starts_of_doi[@]}" | jq -R . | jq -s 'map(ascii_downcase)')" '
  fromjson? // empty
  | select(type == "object" and (has("cutoff") | not))
  | select(
      (.doi | type) == "string"
      and (
        (.doi | ascii_downcase) as $doi
        | any($starts[]; . as $start | $doi | startswith($start))
      )
    )
' "$input_file" > "$kept_output"

input_count=$(jq -R 'fromjson? // empty | select(type == "object" and (has("cutoff") | not))' "$input_file" | jq -s 'length')
kept_count=$(grep -c . "$kept_output" || true)

if [[ -s "$output_file" ]]; then
  existing_output=$output_file
  # Make sure appended lines start on a line of their own.
  if [[ -n "$(tail -c 1 "$output_file")" ]]; then
    echo >> "$output_file"
  fi
else
  existing_output=/dev/null
fi

# Appends kept pairs not already in the output, in input order, without
# duplicating pairs repeated within the input either.
appended_count=$(
  jq -c -n --slurpfile existing "$existing_output" '
    def key: [.url, .doi] | tojson;
    reduce inputs as $pair (
      { seen: ($existing | map({ key: key, value: true }) | from_entries), new: [] };
      ($pair | key) as $k
      | if .seen[$k] then . else .seen[$k] = true | .new += [$pair] end
    )
    | .new[]
  ' "$kept_output" | tee -a "$output_file" | grep -c . || true
)

echo "Read $input_count pairs, $kept_count with a supported DOI, $appended_count of them new" >&2
echo "Appended $appended_count pairs to $output_file" >&2
