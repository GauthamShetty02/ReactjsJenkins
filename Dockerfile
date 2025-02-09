correct below docket file # Step 1: Use Node.js 20.17.0 as the base image
FROM node:20.17.0-alpine

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Step 4: Install npm 10.8.2 explicitly
RUN npm install -g npm@10.8.2 && npm install

# Step 5: Copy the rest of the project files
COPY . .

# Step 6: Expose the port React runs 
EXPOSE 3000

# Step 7: Run the React app
CMD ["npm", "start"]
