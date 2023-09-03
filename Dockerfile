FROM node:18.17.1-slim as base

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install Nest CLI globally (if needed)
RUN yarn global add @nestjs/cli

# Install application dependencies
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Expose the port the application will run on (change it as needed)
EXPOSE 3000

# Define the command to run your application
CMD ["yarn", "start:prod"]
