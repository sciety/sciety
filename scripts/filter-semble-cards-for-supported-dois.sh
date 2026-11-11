#!/usr/bin/env bash
# Keeps only the lines of a JSON Lines file whose doi property starts with a
# supported DOI prefix, and writes them to a separate file. The input file is
# never modified.
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
#                (default <input-file without .jsonl>.supported-dois.jsonl);
#                must not already exist
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

output_file=${2:-"${input_file%.jsonl}.supported-dois.jsonl"}
if [[ -e "$output_file" ]]; then
  echo "Output file already exists, refusing to overwrite: $output_file" >&2
  exit 1
fi

echo "Supported starts of DOI:" >&2
printf '  %s\n' "${starts_of_doi[@]}" >&2

# Lines that are not valid JSON are dropped rather than stopping the script.
jq -c -R --argjson starts "$(printf '%s\n' "${starts_of_doi[@]}" | jq -R . | jq -s 'map(ascii_downcase)')" '
  fromjson? // empty
  | select(
      (.doi | type) == "string"
      and (
        (.doi | ascii_downcase) as $doi
        | any($starts[]; . as $start | $doi | startswith($start))
      )
    )
' "$input_file" > "$output_file"

input_count=$(grep -c . "$input_file" || true)
output_count=$(grep -c . "$output_file" || true)
echo "Read $input_count lines, kept $output_count, dropped $((input_count - output_count))" >&2
echo "Wrote $output_file" >&2
