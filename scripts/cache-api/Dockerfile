FROM node:20-alpine
# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application source code to the container
COPY . .

# Build TypeScript code (if applicable)
RUN npm run build

# Expose port 3000 for the application
EXPOSE 3000
