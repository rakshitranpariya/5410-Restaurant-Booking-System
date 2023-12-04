# Stage 1: Build the React application
FROM node:16 as builder
WORKDIR /app
 
COPY package*.json yarn.lock ./
RUN yarn install
 
COPY . .
RUN yarn build
 
# Stage 2: Create the production-ready image with Nginx
FROM nginx
 
# Remove default Nginx configuration
RUN rm -rf /etc/nginx/conf.d
 
# Copy custom NGINX configuration
COPY nginx /etc/nginx
 
# Expose port 80 for the application
EXPOSE 80
 
# Copy the build output from the builder stage to Nginx's web root
COPY --from=builder /app/build /usr/share/nginx/html