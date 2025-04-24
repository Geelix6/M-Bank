ARG NGINX_IMAGE=nginx:1.28-alpine3.21-perl@sha256:65c45962e829216a8de818472445993443f8727e5ce3dd0ca37249d54073e63e

FROM ${NGINX_IMAGE}

COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY entrypoint.sh /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
