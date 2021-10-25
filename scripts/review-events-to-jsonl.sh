#!/bin/bash
set -euo pipefail

cat $1  | jq --slurp --raw-input --compact-output         'split("\n")               # split lines
        | .[1:]                    # remove header line
        | map(select(length > 0))  # remove empty items
        | map(split(","))          # split each CSV line
        | map({                    # convert to object
            "date": .[0],
            "articleDoi": .[1],
            "evaluationLocator": .[2]
          })
        | .[]                      # flatten for JSONL output
        ' > ${1/.csv/.jsonl}
