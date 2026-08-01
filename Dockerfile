# docker buildx build --platform linux/amd64,linux/arm64 -t swifts32/magnoliawebapp:latest --push .
# ----------------------------------------------------------------
# HOST PLATFORM BUILD ENGINE
# ----------------------------------------------------------------
FROM --platform=$BUILDPLATFORM oven/bun:1 AS build-base
WORKDIR /app

# Install dev dependencies (Host platform - fast build)
FROM build-base AS dependencies
COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install --frozen-lockfile

# SvelteKit Build
FROM build-base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN bunx svelte-kit sync
RUN bun run build

# ----------------------------------------------------------------
# TARGET PLATFORM ENGINE (Compiles target-specific binaries like serialport)
# ----------------------------------------------------------------
FROM oven/bun:1 AS target-base
WORKDIR /app

# Production dependencies (Target platform - e.g., ARM64 native bindings)
FROM target-base AS prod-dependencies
COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install --production --frozen-lockfile

# ----------------------------------------------------------------
# FINAL RUNTIME IMAGE (Target platform - e.g., ARM64)
# ----------------------------------------------------------------
FROM oven/bun:1-slim AS app

# Install udev so node-serialport can find udevadm on the target machine
RUN apt-get update && apt-get install -y --no-install-recommends \
  udev \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# Copy metadata
COPY package.json bun.lock ./

# Copy native target-compiled dependencies
COPY --from=prod-dependencies /app/node_modules ./node_modules

# Copy platform-agnostic JS/CSS output built on the fast host machine
COPY --from=builder /app/build ./build
COPY --from=builder /app/server.js ./server.js

VOLUME /app/data
EXPOSE 8080

CMD ["bun", "server.js"]