# 🐳 CIPFARO E-Learning API Dockerfile
# Multi-stage build for optimized production image

# Stage 1: Base Node.js image with pnpm
FROM node:18-alpine AS base
RUN corepack enable pnpm
WORKDIR /app

# Stage 2: Dependencies installation
FROM base AS dependencies
# Copy package.json files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY infra/package.json ./infra/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 3: Build the application
FROM base AS build
# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=dependencies /app/infra/node_modules ./infra/node_modules

# Copy source code
COPY . .

# Build the API application
WORKDIR /app/apps/api
RUN pnpm build

# Stage 4: Production runtime for DigitalOcean App Platform
FROM node:18-alpine AS runtime

# Install required packages
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 api

WORKDIR /app

# Copy built application and necessary files
COPY --from=build --chown=api:nodejs /app/apps/api/dist ./dist
COPY --from=build --chown=api:nodejs /app/apps/api/package.json ./package.json
COPY --from=build --chown=api:nodejs /app/infra/prisma ./prisma
COPY --from=dependencies /app/apps/api/node_modules ./node_modules

# Set up environment for DigitalOcean App Platform
ENV NODE_ENV=production
ENV PORT=8080

# Expose port 8080 for DigitalOcean App Platform
EXPOSE 8080

# Switch to non-root user
USER api

# Health check endpoint for App Platform
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Start the application with database migration
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]