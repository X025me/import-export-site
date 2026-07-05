FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install && npm run build && cd backend && npm install

WORKDIR /app/backend
EXPOSE 3000

CMD ["npm", "start"]
