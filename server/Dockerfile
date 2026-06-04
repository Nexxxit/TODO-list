FROM node:22-alpine AS base
WORKDIR /app

FROM base AS runner

COPY package.json ./
COPY prisma prisma.config.ts ./
RUN npm install --ignore-scripts

COPY . .
RUN npx prisma generate && npm run build

ENV NODE_ENV=production

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN sed -i 's/\r$//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

EXPOSE 3001
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]
