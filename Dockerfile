# Stage 1: Build the application
FROM node:16 as builder

WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package*.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Stage 2: Create the production-ready image with Nginx
FROM nginx

# Expose port 80 for the application
EXPOSE 80

# Copy the build output from the builder stage to Nginx's web root
COPY --from=builder /app/build /usr/share/nginx/html

