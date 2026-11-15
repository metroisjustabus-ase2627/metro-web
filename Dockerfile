# syntax=docker/dockerfile:1

# Stage 1: Build Angular application
FROM node:22-alpine AS build
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

# Stage 2: Serve with Nginx
FROM nginx:1.27-alpine AS final

# Install curl for healthcheck (NFR-OBS-01, CON-CI-04)
RUN apk add --no-cache curl

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration for SPA routing and healthcheck
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from previous stage
COPY --from=build /app/dist/metro-web/browser /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://127.0.0.1/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
