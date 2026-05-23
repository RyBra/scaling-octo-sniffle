FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
WORKDIR /app

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @construction-journal/shared build
RUN pnpm --filter api exec prisma generate
RUN pnpm --filter api build
RUN cd /app/apps/api && pnpm exec tsc prisma/seed.ts \
      --esModuleInterop --module commonjs --target ES2021 \
      --moduleResolution node --outDir prisma --skipLibCheck

FROM base AS deploy
COPY --from=builder /app .
RUN pnpm deploy --filter api --prod --legacy /prod/api

FROM node:20-alpine AS runner
RUN apk add --no-cache openssl wget && npm install -g prisma@6.19.3
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deploy /prod/api .
COPY apps/api/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENV PATH="/app/node_modules/.bin:$PATH"
ENTRYPOINT ["/docker-entrypoint.sh"]
