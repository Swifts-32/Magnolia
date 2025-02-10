FROM node:20-alpine AS builder

WORKDIR /app

# Create data directory first
RUN mkdir -p /app/data/layouts

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the app
RUN npm run build

# --------------------------------

FROM node:20-alpine AS express_server

WORKDIR /app

# Create data directory
RUN mkdir -p /app/data/layouts

# Copy build artifacts and package files
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/server.js ./

# Install production dependencies only
RUN npm install --only=production

# Create a volume for persistent data
VOLUME /app/data

EXPOSE 8080

# Start the express server
CMD ["node", "server.js"]