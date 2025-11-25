FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# 🔴 CHANGE: Use 'npm ci' + '--only=production' to save RAM
RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD ["npm", "start"]