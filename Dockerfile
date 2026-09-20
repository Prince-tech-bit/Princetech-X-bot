FROM node:20-bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends git ffmpeg imagemagick webp && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm","start"]
