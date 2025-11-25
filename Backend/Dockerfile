# 🔴 FIX: Use standard node image (Debian) instead of alpine.
# Alpine causes 'bcrypt' to compile from source, which hangs your server.
FROM node:18

WORKDIR /app

COPY package*.json ./

# 🔴 FIX: Update apt-get and install build tools required for bcrypt
# This prevents the "freeze" if it decides to compile.
RUN apt-get update && apt-get install -y python3 make g++ build-essential

# Network timeouts for college wifi
RUN npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-retry-mintimeout 10000

# Install dependencies
RUN npm install --omit=dev --no-audit --verbose

COPY . .

EXPOSE 3000
CMD ["npm", "start"]