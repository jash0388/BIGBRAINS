# ── Stage 1: Build everything ─────────────────────────────────────────────────
FROM node:20-slim AS builder

# Install pnpm (match version used in dev)
RUN npm install -g pnpm@10

WORKDIR /app

# Copy full monorepo (node_modules excluded via .dockerignore)
COPY . .

# Install all workspace dependencies
RUN pnpm install --frozen-lockfile

# Build the Vite frontend (BASE_PATH=/ means assets served at root)
RUN BASE_PATH=/ PORT=3000 NODE_ENV=production \
    pnpm --filter @workspace/rubrix-website run build

# Build the Express API server (esbuild bundles everything)
RUN pnpm --filter @workspace/api-server run build

# ── Stage 2: Lean runtime image ───────────────────────────────────────────────
FROM node:20-slim AS runner

WORKDIR /app

# API server bundle (esbuild output — self-contained, no node_modules needed)
COPY --from=builder /app/artifacts/api-server/dist ./artifacts/api-server/dist

# Frontend static assets (served by Express)
COPY --from=builder /app/artifacts/rubrix-website/dist/public ./artifacts/rubrix-website/dist/public

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "--enable-source-maps", "./artifacts/api-server/dist/index.mjs"]
