FROM node:20-bookworm-slim

# Install git, ssh client and other system dependencies in one layer
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    openssh-client \
    ffmpeg \
    imagemagick \
    webp \
    && rm -rf /var/lib/apt/lists/*

# Configure git to use HTTPS instead of SSH for GitHub
RUN git config --global url."https://github.com/".insteadOf ssh://git@github.com/

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (git and https are now available for git-hosted packages)
RUN npm install --omit=dev

# Copy application code
COPY . .

# Expose port for HTTP server
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Start the bot
CMD ["npm", "start"]
