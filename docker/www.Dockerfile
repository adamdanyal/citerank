# CiteRank.com marketing site (apps/www) as a Nitro server, for hosts without
# Vercel. Build from the repository root:
#   docker build -f docker/www.Dockerfile -t citerank-www .
# The VITE_* values are baked in at build time, so pass them as build args.
FROM node:24-alpine AS base
RUN corepack enable pnpm
RUN apk add --no-cache curl

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/www/package.json ./apps/www/
COPY packages/api-spec/package.json ./packages/api-spec/
COPY packages/config/package.json ./packages/config/
COPY packages/docs/package.json ./packages/docs/
COPY packages/og/package.json ./packages/og/
COPY packages/ui/package.json ./packages/ui/
RUN pnpm install --frozen-lockfile --filter @workspace/www...

FROM base AS build
WORKDIR /app
ARG VITE_MARKETING_SITE_URL
ARG VITE_CLOUD_APP_URL
ARG VITE_DEMO_SITE_URL
ARG VITE_POSTHOG_KEY
ARG VITE_IMAGE_OPTIMIZER
ENV VITE_MARKETING_SITE_URL=$VITE_MARKETING_SITE_URL \
    VITE_CLOUD_APP_URL=$VITE_CLOUD_APP_URL \
    VITE_DEMO_SITE_URL=$VITE_DEMO_SITE_URL \
    VITE_POSTHOG_KEY=$VITE_POSTHOG_KEY \
    VITE_IMAGE_OPTIMIZER=$VITE_IMAGE_OPTIMIZER
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/www/node_modules ./apps/www/node_modules
COPY --from=deps /app/packages/api-spec/node_modules ./packages/api-spec/node_modules
COPY --from=deps /app/packages/config/node_modules ./packages/config/node_modules
COPY --from=deps /app/packages/docs/node_modules ./packages/docs/node_modules
COPY --from=deps /app/packages/og/node_modules ./packages/og/node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules
COPY . .
RUN pnpm --filter @workspace/www build

FROM base AS www
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 www
COPY --from=build --chown=www:nodejs /app/apps/www/.output ./.output
USER www
EXPOSE 3000
ENV PORT=3000
ENV HOST="0.0.0.0"
CMD ["node", ".output/server/index.mjs"]
