FROM node:13.12.0-alpine
WORKDIR /app/frontend

COPY package.json package-lock.json ./
RUN npm install
COPY . /app/frontend
EXPOSE 3000