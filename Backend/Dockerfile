FROM node:22-alpine

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json .  

# Install dependencies
RUN npm install

# Copy required folders and files explicitly
COPY app.js .
COPY config/ config/
COPY middleware/ middleware/
COPY models/ models/
COPY routes/ routes/
COPY __tests__/ __tests__/

# Ensure ownership is correct for the non-root user
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

# Expose application port
EXPOSE 8082

# Run the application as the non-root user
CMD [ "node", "app.js" ]