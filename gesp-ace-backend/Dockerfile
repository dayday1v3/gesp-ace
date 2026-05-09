FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache tini

USER node

COPY --chown=node:node package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --chown=node:node prisma ./prisma
RUN npx prisma generate

COPY --chown=node:node --chmod=755 . .

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/app.js"]
