# ============================================================
# Stage 1: deps
# Install dependencies saja, dipakai sebagai cache layer
# ============================================================
FROM oven/bun:1.2-alpine AS deps

WORKDIR /app

# Copy file manifest dependensi
COPY package.json bun.lock ./

# Install SEMUA dependensi (termasuk devDeps untuk build)
RUN bun install --frozen-lockfile

# ============================================================
# Stage 2: builder
# Build aplikasi Next.js ke mode standalone
# ============================================================
FROM oven/bun:1.2-alpine AS builder

WORKDIR /app

# Copy node_modules dari stage deps
COPY --from=deps /app/node_modules ./node_modules

# Copy seluruh source code
COPY . .

# Set environment agar Next.js tahu ini adalah build produksi
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js → menghasilkan .next/standalone
RUN bun run build

# ============================================================
# Stage 3: runner (Production Image)
# Image final yang sesimpel mungkin, tanpa source code dan devDeps
# ============================================================
FROM node:22-alpine AS runner

WORKDIR /app

# Security: jalankan sebagai non-root user
# Cloud Run by default mengizinkan non-root user
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

# Set environment produksi
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Port yang akan digunakan (Cloud Run default: 8080)
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Copy static assets publik
COPY --from=builder /app/public ./public

# Copy output standalone Next.js
# Mode standalone sudah menyertakan server.js minimal + semua deps yang diperlukan
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Gunakan user non-root
USER nextjs

# Expose port untuk Cloud Run
EXPOSE 8080

# Health check (opsional, Cloud Run menggunakan HTTP health check bawaan)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/health 2>/dev/null || exit 1

# Jalankan server Next.js standalone menggunakan Node.js
# (Bun kompatibel, tapi Node lebih stabil untuk production standalone)
CMD ["node", "server.js"]
