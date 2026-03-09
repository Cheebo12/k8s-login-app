# Use slim to cut 1GB of bloat
FROM node:20-slim

WORKDIR /app

# Install deps first (better caching)
COPY package*.json ./
RUN npm install

# Copy app code
COPY . .

EXPOSE 3000
CMD ["/bin/sh", "-c", "node createuser.js && node server.js"]
