# Use official Node.js LTS version
FROM node:lts

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .

# Expose the application port (optional, if you need to expose a port)
EXPOSE 3000

# Run the application
CMD ["node", "index.js"]