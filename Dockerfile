FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   COPY .env . 
   RUN npm ci
   COPY . .
   RUN npm run build
   ENV NODE_ENV=development
   EXPOSE 3000
   CMD ["node", "dist/src/main.js"]