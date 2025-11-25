FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# 🔴 FIX 1: Network settings
RUN npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-retry-mintimeout 10000 \
    && npm config set registry https://registry.npmjs.org/

# 🔴 FIX 2: Lightweight install with logs
RUN npm install --omit=dev --no-audit --verbose

COPY . .

# Build the frontend
RUN npm run build

# Install serve
RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "80"]

EXPOSE 80