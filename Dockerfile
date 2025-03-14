# Build stage
FROM node:20.9.0-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Use npm install instead of npm ci to update the shrinkwrap file
RUN npm install && \
    npm install terser@5.26.0 rollup@4.9.0 && \
    npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:1.25.3-alpine

# Copy built assets and config
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Setup security
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup && \
    chown -R appuser:appgroup /usr/share/nginx/html

USER appuser

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 