# docker buildx build --platform linux/amd64,linux/arm64 -t swifts32/magnoliawebapp:latest  --push .

FROM node:20-slim AS base
WORKDIR /app

# Dependency stage (shared by both build and runtime)
FROM base AS dependencies
COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm \
  npm ci

# --------------------------------

# Build stage
FROM base AS builder
# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Cache the SvelteKit and Vite build directories across docker builds
RUN --mount=type=cache,target=/app/.svelte-kit \
    --mount=type=cache,target=/app/node_modules/.vite \
    npx svelte-kit sync && npm run build
# # SvelteKit/Vite build process
# RUN npm run build

# --------------------------------

# Production dependencies stage
FROM base AS prod-dependencies
COPY package*.json ./
# Clean install only production packages, caching the npm cache
RUN --mount=type=cache,target=/root/.npm \
  npm ci --omit=dev

# Final lean runtime stage
FROM node:20-slim AS app
WORKDIR /app

ENV NODE_ENV=production

# Copy package metadata
COPY package*.json ./
# Copy production-only dependencies (much smaller than development node_modules)
COPY --from=prod-dependencies /app/node_modules ./node_modules
# Copy compiled SvelteKit build output and entrypoint
COPY --from=builder /app/build ./build
COPY --from=builder /app/server.js ./server.js


VOLUME /app/data
EXPOSE 8080

# Start the express server
CMD ["node", "server.js"]