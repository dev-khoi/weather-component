FROM node:20.19.0-alpine
WORKDIR /app

# Copy package files
COPY package*.json prisma/* ./

# Install dependencies
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npm install
COPY . .

# Copy source code

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

CMD ["npm", "run", "start"]