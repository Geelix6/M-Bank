ARG NODE_IMAGE=node:22.15.0-alpine3.21@sha256:5ef237d055ac3c076f47eda1310f2214eb23c30a53aecdc20c35fd17780fa4ee

FROM ${NODE_IMAGE} AS builder

WORKDIR /app

RUN npm install -g pnpm@10

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY src ./src
COPY prisma ./prisma
COPY tsconfig*.json .

RUN npx prisma generate

RUN pnpm run build

RUN pnpm prune --prod

FROM ${NODE_IMAGE} AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV PORT=3002
EXPOSE ${PORT}

CMD ["node", "dist/main"]
