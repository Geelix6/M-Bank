ARG NODE_IMAGE=node:22.15.0-alpine3.21@sha256:5ef237d055ac3c076f47eda1310f2214eb23c30a53aecdc20c35fd17780fa4ee
ARG NGINX_IMAGE=nginx:1.28-alpine3.21-perl@sha256:65c45962e829216a8de818472445993443f8727e5ce3dd0ca37249d54073e63e

FROM ${NODE_IMAGE} AS builder

WORKDIR /app

RUN npm i -g pnpm@10 

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM ${NGINX_IMAGE} AS runner

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
