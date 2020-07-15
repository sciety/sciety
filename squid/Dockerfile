FROM alpine:3.12.0

RUN apk add --no-cache squid

COPY squid.conf /etc/squid/squid.conf

RUN /usr/lib/squid/security_file_certgen -c -s /var/cache/squid/ssl_db -M 4MB && \
  chown --recursive squid: /var/cache/squid/ssl_db

CMD squid -N
