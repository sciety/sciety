#! /bin/sh

rm -f static/style.css static/style.css.map

node_modules/.bin/sass --watch --embed-sources --load-path=src/shared-sass src/read-side/html-pages/style.scss:static/style.css &
pid1=$!

node_modules/.bin/tsx watch ./src/index.ts &
pid2=$!

trap "echo 'Caught signal; killing watchers'; kill ${pid1} ${pid2}; exit 1" INT QUIT TERM
wait
