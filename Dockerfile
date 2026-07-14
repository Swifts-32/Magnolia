# docker buildx build --platform linux/amd64,linux/arm64 -t swifts32/magnoliawebapp:latest  --push .

FROM node:20 AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the app
RUN npm run build

# --------------------------------

FROM node:20 AS app

WORKDIR /app

# Copy only what the runtime needs
COPY package*.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/server.js ./server.js

# Create data directory
# RUN mkdir -p /app/data/layouts

# RUN apk add --no-cache udev usbutils python3 make g++ postgresql-client
# RUN apt-get update && apt-get install -y \
#     postgresql-client \
#     udev \
#     && rm -rf /var/lib/apt/lists/*

# Copy build artifacts and package files
# COPY --from=builder /app/build ./build
# COPY --from=builder /app/package.json ./
# COPY --from=builder /app/server.js ./

# Drizzle stuff - Remember to generate migrations npx drizzle-kit generate
# COPY --from=builder /app/drizzle-prod.config.ts ./
# COPY --from=builder /app/src/lib/server/db/migrations ./migrations
# COPY --from=builder /app/src/lib/server/db/schema ./schema

# Install production dependencies only
# RUN npm install --omit=dev
# RUN npm install -g drizzle-kit

RUN npm ci --omit=dev

# ENV PATH="/usr/local/bin:${PATH}"
ENV NODE_ENV=production

# Create a volume for persistent data
VOLUME /app/data

EXPOSE 8080

# Start the express server
CMD ["node", "server.js"]