FROM node:10

WORKDIR /app/server

COPY package*.json /app/server/

RUN npm install

COPY . /app/server

ARG server_port
# 4000
EXPOSE ${server_port}

CMD npm start
