FROM node:22-alpine

WORKDIR /app

COPY . .

WORKDIR /app/backend

RUN npm install

EXPOSE 3000

CMD ["node", "app.js"]