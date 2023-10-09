FROM node:18-alpine as base

WORKDIR /
COPY package*.json /
EXPOSE 3000
ENV NODE_ENV=development
RUN npm install
COPY . /
CMD ["node", "index.js"]
