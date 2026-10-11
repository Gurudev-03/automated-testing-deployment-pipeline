# ═══════════════════════════════════════════════════════════════
#  Multi-stage Dockerfile — Task Manager
#  Stage 1: backend-builder  → install + test backend
#  Stage 2: frontend-builder → install + test + build frontend
#  Stage 3: runtime          → Nginx serves frontend + Node API
# ═══════════════════════════════════════════════════════════════

# ── Stage 1: Backend ────────────────────────────────────────────
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN npm test
RUN echo "Backend tests passed ✅"

# ── Stage 2: Frontend ────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm test
RUN npm run build
RUN echo "Frontend tests passed ✅ Build complete ✅"

# ── Stage 3: Runtime ─────────────────────────────────────────────
FROM node:20-alpine AS runtime

LABEL org.opencontainers.image.title="task-manager"
LABEL org.opencontainers.image.description="Task Manager — Automated Testing & Deployment Pipeline"
LABEL org.opencontainers.image.source="https://github.com/Gurudev-03/automated-testing-deployment-pipeline"
LABEL org.opencontainers.image.licenses="MIT"

# Install nginx
RUN apk add --no-cache nginx

WORKDIR /app

# Copy backend
COPY --from=backend-builder /app/backend ./backend

# Copy built frontend into nginx html
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

# Create startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'cd /app/backend && node src/server.js &' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

EXPOSE 80 5000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["/start.sh"]
