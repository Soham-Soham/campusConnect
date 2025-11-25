# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Set network timeouts & registry
RUN npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-retry-mintimeout 10000 \
    && npm config set registry https://registry.npmjs.org/

# Install ALL dependencies (including devDependencies like vite)
RUN npm ci --verbose

COPY . .

# Build the frontend
RUN npm run build

# Stage 2: Runner
FROM node:18-alpine AS runner

WORKDIR /app

# Install serve globally in the runner stage
RUN npm install -g serve

# Copy only the build output from the builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 80

CMD ["serve", "-s", "dist", "-l", "80"]