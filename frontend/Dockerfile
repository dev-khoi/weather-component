# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy package files and built assets
COPY package*.json ./

# Install dependencies
RUN npm ci

COPY . .

# Build the application
RUN npm run build

# Install only production dependencies (for preview server)
RUN npm ci

# Expose port 4173
EXPOSE 4173

CMD ["npm", "run", "preview"]