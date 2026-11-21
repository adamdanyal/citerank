# The marketing site (apps/www). docker/Dockerfile builds only the app and the worker.
# Build from the repository root: docker build -f deploy/www.Dockerfile .

FROM node:24-alpine AS base
RUN corepack enable pnpm

FROM base AS build
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile

# Vite fixes these site addresses into the bundle. Left empty, the build keeps
# the live ones; a test deployment passes its own.
ARG VITE_MARKETING_SITE_URL
ARG VITE_CLOUD_APP_URL
ARG VITE_DEMO_SITE_URL
ENV VITE_MARKETING_SITE_URL=$VITE_MARKETING_SITE_URL \
    VITE_CLOUD_APP_URL=$VITE_CLOUD_APP_URL \
    VITE_DEMO_SITE_URL=$VITE_DEMO_SITE_URL

RUN pnpm --filter @workspace/www build

FROM base AS www
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0
COPY --from=build --chown=node:node /app/apps/www/.output ./.output
USER node
EXPOSE 3001
CMD ["node", ".output/server/index.mjs"]
