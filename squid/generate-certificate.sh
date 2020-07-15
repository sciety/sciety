#!/usr/bin/env bash

openssl req -config ./cert.conf -newkey rsa:4096 -x509 -keyout ./squid.key -out ./squid.crt -days 365 -nodes
