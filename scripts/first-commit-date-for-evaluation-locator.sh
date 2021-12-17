#!/bin/bash

git log --date=iso -S $1 \
  | tail -3 \
  | head -1 \
  | sed -e 's/Date: *//' -e 's/ /T/' -e 's/ \+.*//'
