# Use Node 20 LTS as base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the backend source code
COPY . .

# Expose the backend port
EXPOSE 5050

# Start the server
CMD ["node", "server.js"]
