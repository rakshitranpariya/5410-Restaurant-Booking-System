# Stage 1: Build the React application
FROM node:16-slim

# Set the working directory inside the container

WORKDIR /app
 
# Copy the package.json and package-lock.json files to the container's working directory

COPY package.json ./
 
# Install dependencies

RUN rm -rf node_modules package-lock.json
RUN npm install --verbose
 
 
# Copy the rest of the application code to the container's working directory

COPY src ./src

COPY public ./public
 
# Build the React app

RUN npm run build
 
# Remove unnecessary node_modules (if needed)

RUN rm -rf node_modules
 
# Install serve globally

RUN npm i -g serve
 
# Set the command to start the server

CMD ["serve", "-s", "build"]