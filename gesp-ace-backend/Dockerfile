FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src
RUN npx prisma generate

FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache tini wget

USER node

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=node:node /app/node_modules/@prisma ./node_modules/@prisma

COPY --chown=node:node prisma ./prisma
COPY --chown=node:node src ./src
COPY --chown=node:node tsconfig.json ./

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npx", "tsx", "src/app.ts"]
