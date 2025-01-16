# Use Node.js v18.18.2 as the base image
FROM node:18.18.2

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and yarn.lock for dependency installation
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the entire project into the container
COPY . .

# Copy the .env file (ensure it exists locally but is ignored in Git)
COPY .env .env

# Compile Hardhat contracts to generate artifacts
RUN npx hardhat compile

# Expose the default Hardhat network port (optional)
EXPOSE 8545

# Default command to keep the container interactive
CMD ["yarn", "start"]
