#! /bin/sh

git log --grep="#$1" --name-only --oneline | grep 'src/\|test/' | sort -u