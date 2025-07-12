FROM node:20-alpine

WORKDIR /usr/app
COPY package*.json ./
RUN npm ci --production
RUN npm install @nestjs/cli
COPY . .
RUN rm -rf dist
RUN npm run build
