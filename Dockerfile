# syntax=docker/dockerfile:1

# Stage 1: Build Angular application (Build Only Once — T03)
FROM node:24-alpine AS build
WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install dependencies deterministically
RUN npm ci

# Copy application configuration and source code
COPY angular.json tsconfig.json tsconfig.app.json tsconfig.spec.json ./
COPY src/ src/
COPY public/ public/

# Build production bundle
RUN npm run build

# Stage 2: Serve with Nginx (reusable immutable image across Local, Dev VM, and Prod VM)
FROM nginx:1.27-alpine AS final

ARG APP_VERSION=dev
ENV APP_VERSION=${APP_VERSION}
ENV API_UPSTREAM=http://api:8080

# Install curl for healthcheck (NFR-OBS-01, CON-CI-04)
RUN apk add --no-cache curl

# Remove default nginx config and register envsubst template for runtime API_UPSTREAM
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy build artifacts from previous stage
COPY --from=build /app/dist/metro-web/browser /usr/share/nginx/html

# Bake immutable deployment version metadata for GET /health (CON-CI-02)
RUN printf '{"status":"Healthy","service":"metro-web","version":"%s"}\n' "$APP_VERSION" > /usr/share/nginx/html/health.json

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -fsS http://127.0.0.1/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
