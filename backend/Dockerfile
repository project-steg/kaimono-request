FROM node:latest

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --no-optional && npm cache clean --force

RUN npm install pm2 -g

RUN npm install sequelize-cli -g

COPY . .

EXPOSE 5000

ENTRYPOINT ./entrypoint.sh