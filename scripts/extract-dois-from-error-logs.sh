cat $1 | grep -o '"doi":"[^"]*"' | cut -d '"' -f 4 | sort -u
