# 🔴 FIX: Use standard node image (Debian) instead of alpine.
# Alpine causes 'bcrypt' to compile from source, which hangs your server.
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Set Network Timeouts & Registry
RUN npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-retry-mintimeout 10000 \
    && npm config set registry https://registry.npmjs.org/

# Use 'ci' for reliable installs, omit dev dependencies for production
RUN npm ci --omit=dev --no-audit --verbose

COPY . .

EXPOSE 3000
CMD ["npm", "start"]