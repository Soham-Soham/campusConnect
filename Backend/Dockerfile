FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# 🔴 FIX 1: Set Network Timeouts & Registry (Helps with college firewalls)
RUN npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-retry-mintimeout 10000 \
    && npm config set registry https://registry.npmjs.org/

# 🔴 FIX 2: Use 'install' instead of 'ci'
# --omit=dev: Don't install developer tools (Saves RAM)
# --no-audit: Don't check for security risks (Saves RAM & Time)
# --verbose: Show us EXACTLY what is happening (Don't hide logs)
RUN npm install --omit=dev --no-audit --verbose

COPY . .

EXPOSE 3000
CMD ["npm", "start"]