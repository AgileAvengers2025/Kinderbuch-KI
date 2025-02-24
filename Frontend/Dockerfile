# Use Node.js to build the Next.js app
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package.json package-lock.json . 
RUN npm install 

# Copy the entire project
COPY . .

# Build the Next.js app
RUN npm run build

# Create a smaller runtime container
FROM node:22-alpine AS runner

WORKDIR /app

# Copy only necessary files from the build container
COPY --from=build /app/.next .next
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/package.json package.json

# Copy public folder to include static files (images, etc.)
COPY --from=build /app/public public

# Set production environment
# ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "start"]