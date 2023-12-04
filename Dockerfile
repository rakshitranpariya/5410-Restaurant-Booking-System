# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Expose the port that Cloud Run will use
EXPOSE 8080

# Define the command to run your app
CMD ["npm", "start"]
