# Use Node.js to build the Next.js app
FROM node:22-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json before installing dependencies
COPY package.json package-lock.json . 
RUN npm install 

# Copy the entire project
COPY . .

# Build the Next.js app
RUN npm run build

# Create a smaller runtime container
FROM node:22-alpine AS runner

WORKDIR /app

# Copy build files and dependencies
COPY --from=build /app/.next .next
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/package.json package.json

# Copy public folder to include static files (images, etc.)
COPY --from=build /app/public public

EXPOSE 3000

CMD ["npm", "run", "start"]
