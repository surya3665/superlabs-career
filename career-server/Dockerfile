# Build stage
FROM node:20-slim AS build

# Create app directory
WORKDIR /usr/src/app

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install ALL dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Optional: Run any build steps if your app has them
# RUN yarn build

# Production stage
FROM node:20-slim AS production

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    APP_USER=node \
    # Use node user/group provided by the base image
    APP_GROUP=node \
    APP_DIR=/usr/src/app

# Install runtime dependencies and build tools
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR ${APP_DIR}

# Copy package.json and yarn.lock from build stage
COPY --from=build ${APP_DIR}/package.json ./package.json
COPY --from=build ${APP_DIR}/yarn.lock ./yarn.lock

# Install ONLY production dependencies and build native modules
RUN yarn install --production --frozen-lockfile

# Clean up build tools after installation
RUN apt-get purge -y --auto-remove python3 make g++

# Copy application code from build stage
COPY --from=build ${APP_DIR}/app.js ./
COPY --from=build ${APP_DIR}/router ./router
COPY --from=build ${APP_DIR}/controller ./controller
COPY --from=build ${APP_DIR}/config ./config
# Note: We don't copy uploads from build, it should be a volume

# Create directory for .env file (volume mounted)
RUN mkdir -p ./config

# Create directory for uploads (volume mounted)
RUN mkdir -p uploads

# Switch to non-root user provided by node image
# Ensure ownership before switching
RUN chown -R ${APP_USER}:${APP_GROUP} ${APP_DIR}
USER ${APP_USER}

# Expose the port the app runs on
EXPOSE ${PORT}

# Command to run the app
CMD ["node", "app.js"]
