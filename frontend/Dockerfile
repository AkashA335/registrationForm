# Use Node.js LTS as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Expose port 5173 for development
EXPOSE 5173

# Start Vite in development mode
CMD ["npm", "run", "dev"]
