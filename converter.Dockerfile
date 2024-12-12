# Use Node 22.12 bookworm as base image
FROM node:22.12-bookworm AS base

# Development stage
# =============================================================================
# Create a development stage based on the "base" image
FROM base AS development

# Change the working directory to /node
WORKDIR /node

# Copy the package.json and package-lock.json files to /node
COPY package*.json ./

# Install all dependencies and clean the cache
RUN npm ci && npm cache clean --force

# Change the working directory to /node/app
# This is where the project directory will be mounted to
WORKDIR /node/app

# Run the `dev` script for auto-reloading
CMD ["npm", "run", "dev:converter"]

# Production stage
# =============================================================================
# Create a production stage based on the "base" image
FROM base AS production

# Change the working directory to /build
WORKDIR /build

# Copy the package.json and package-lock.json files to the /build directory
COPY package*.json ./

# Install production dependencies and clean the cache
RUN npm ci --omit=dev  && npm cache clean --force

# Copy the entire source code into the container
COPY . .

# Document the port that may need to be published
EXPOSE 8001

# Start the application
CMD ["npm", "run", "start:converter"]
