# 🐳 CIPFARO E-Learning Web Application Dockerfile
# Multi-stage build for optimized production image

# Stage 1: Base Node.js image with pnpm
FROM node:18-alpine AS base
RUN corepack enable pnpm
WORKDIR /app

# Stage 2: Dependencies installation
FROM base AS dependencies
# Copy package.json files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/scorm-runtime/package.json ./packages/scorm-runtime/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 3: Build the application
FROM base AS build
# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=dependencies /app/packages/scorm-runtime/node_modules ./packages/scorm-runtime/node_modules

# Copy source code
COPY . .

# Build the Next.js application
WORKDIR /app/apps/web
RUN pnpm build

# Stage 4: Production runtime
FROM node:18-alpine AS runtime

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

# Copy built application
COPY --from=build --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Set up environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Expose port
EXPOSE 3000

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "apps/web/server.js"]