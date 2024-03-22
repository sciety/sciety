#!/bin/sh
curl -v "https://sciety.eu.auth0.com/api/v2/users/twitter|$1" -H "Authorization: Bearer $MANAGEMENT_API_TOKEN"
