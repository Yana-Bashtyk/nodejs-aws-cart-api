# Use the official AWS Lambda Node.js 18 image as the base image
FROM public.ecr.aws/lambda/nodejs:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm ci --verbose || (cat /root/.npm/_logs/*-debug.log && false)

# Copy the rest of the application code to the working directory
COPY . .

# Build the Nest.js application
RUN npm run build

# Set the Lambda handler
CMD ["dist/src/main.cartApiHandler"]