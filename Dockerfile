# Use an official Node runtime as a base image
FROM node:18

# Set the working directory in the container
WORKDIR /.
# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Build the frontend app
RUN npm run build

# Expose port 500 to the outside world
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]