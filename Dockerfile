# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the project
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configure nginx to handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 9999
EXPOSE 9999

# Start nginx
CMD ["nginx", "-g", "daemon off;"]