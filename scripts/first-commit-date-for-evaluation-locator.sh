#!/bin/bash

git log --date=iso -S $1 \
  | grep -E '^Date:' \
  | tail -1 \
  | sed -e 's/Date: *//' -e 's/ /T/' -e 's/ \+.*//'
