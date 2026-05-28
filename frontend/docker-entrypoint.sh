#!/bin/sh
set -eu

: "${NUXT_API_PROXY_TARGET:=http://backend:8000}"

envsubst '${NUXT_API_PROXY_TARGET} ${NUXT_PUBLIC_API_KEY}' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
