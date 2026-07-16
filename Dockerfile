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

# Generates typescript and svelte-kit config files dynamically
RUN npx svelte-kit sync

# Run the build standardly without mounting .svelte-kit as a cache
RUN npm run build

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

# Install udev so node-serialport can find udevadm
RUN apt-get update && apt-get install -y --no-install-recommends \
    udev \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# Copy package metadata
COPY package*.json ./
# Copy production-only dependencies
COPY --from=prod-dependencies /app/node_modules ./node_modules
# Copy compiled SvelteKit build output and entrypoint
COPY --from=builder /app/build ./build
COPY --from=builder /app/server.js ./server.js


VOLUME /app/data
EXPOSE 8080

# Start the express server
CMD ["node", "server.js"]