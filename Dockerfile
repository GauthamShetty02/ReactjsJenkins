# Step 1: Use an official Node.js image
FROM node:20.17.0-alpine AS build

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install npm 10.8.2 explicitly and dependencies
RUN npm install -g npm@10.8.2 && npm install

# Step 5: Copy the rest of the project files
COPY . .

# Step 6: Build the React app for production
RUN npm run build

# Step 7: Use Nginx for serving the built React app
FROM nginx:alpine

# Step 8: Copy the built app to Nginx public directory
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose the default Nginx port
EXPOSE 80

# Step 10: Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
