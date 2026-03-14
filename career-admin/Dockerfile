# # Build stage
# FROM node:20-alpine AS build

# # Set working directory
# WORKDIR /app

# # Copy package.json and yarn.lock
# COPY package.json yarn.lock ./

# # Install dependencies
# RUN yarn install --frozen-lockfile

# # Copy app files
# COPY . .

# # Build app
# RUN yarn build

# # Production stage
# FROM node:20-alpine AS production

# # Set environment variables
# ENV NODE_ENV=production

# # Set working directory
# WORKDIR /app

# # Install serve to run the application
# RUN yarn global add serve

# # Copy built assets from build stage
# COPY --from=build /app/dist ./dist
# COPY --from=build /app/package.json ./

# # Expose port
# EXPOSE 80

# # Run the app
# CMD ["serve", "-s", "dist", "-l", "80"]

# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Production stage
FROM nginx:alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]