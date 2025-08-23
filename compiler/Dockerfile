# Use Node.js
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the compiler code
COPY . .

# Expose compiler service port (replace 8000 if your compiler uses a different one)
EXPOSE $PORT

# Start the compiler service
CMD ["node", "index.js"]
