# Use an official Node runtime as a parent image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN npm install

# Expose port
EXPOSE 3000

# Copy the app source code
COPY . .

# Run the app
CMD [ "npm", "run", "start:dev" ]