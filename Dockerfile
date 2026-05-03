# ── Stage 1: Build the React app ──────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev, needed for vite build)
RUN npm install

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# ── Stage 2: Production server ────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copy package files and install only production deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy built frontend from Stage 1
COPY --from=builder /app/dist ./dist

# Copy server
COPY server.js ./

EXPOSE 8080

CMD ["node", "server.js"]