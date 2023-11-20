# phase 1
FROM node:20-alpine as build
WORKDIR /app
COPY *.json .
# COPY jest.config.js .
RUN npm install
COPY . .
CMD [ "npm", "start" ]

