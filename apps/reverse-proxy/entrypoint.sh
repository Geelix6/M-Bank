#!/bin/sh
envsubst '\$API_GATEWAY_PORT \$KC_PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'