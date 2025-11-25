FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# 🔴 CHANGE: Use 'npm ci' + '--only=production' here too
RUN npm ci --only=production

COPY . .

# Build the frontend
RUN npm run build

# Install a simple server
RUN npm install -g serve

# Serve the 'dist' folder
CMD ["serve", "-s", "dist", "-l", "80"]

EXPOSE 80