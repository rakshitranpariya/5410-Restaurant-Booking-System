# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install app dependencies using Yarn
RUN yarn install --frozen-lockfile

# Copy the application code to the working directory
COPY . .

# Build the React app
RUN yarn build

# Expose the port that your React app is listening on
EXPOSE 80

# Define the command to run your app
CMD ["yarn", "start"]
