# docker buildx build --platform linux/amd64,linux/arm64 -t swifts32/magnoliawebapp:latest  --push .
# ----------------------------------------------------------------
# HOST PLATFORM BUILD ENGINE
# ----------------------------------------------------------------
FROM --platform=$BUILDPLATFORM node:20-slim AS build-base
WORKDIR /app

# Install dev dependencies (Host platform)
FROM build-base AS dependencies
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
  npm ci

# 2velteKit Build
FROM build-base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npx svelte-kit sync
RUN npm run build

# ----------------------------------------------------------------
# TARGET PLATFORM ENGINE (Compiles target-specific binaries like serialport)
# ----------------------------------------------------------------
FROM node:20-slim AS target-base
WORKDIR /app

# 3. Production dependencies (Target platform - e.g., ARM64)
FROM target-base AS prod-dependencies
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
  npm ci --omit=dev

# ----------------------------------------------------------------
# FINAL RUNTIME IMAGE (Target platform - e.g., ARM64)
# ----------------------------------------------------------------
FROM target-base AS app

# Install udev so node-serialport can find udevadm on the target machine
RUN apt-get update && apt-get install -y --no-install-recommends \
  udev \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# Copy metadata
COPY package*.json ./

# Copy native target-compiled dependencies
COPY --from=prod-dependencies /app/node_modules ./node_modules

# Copy platform-agnostic JS/CSS output built on the fast host machine
COPY --from=builder /app/build ./build
COPY --from=builder /app/server.js ./server.js

VOLUME /app/data
EXPOSE 8080

CMD ["node", "server.js"]