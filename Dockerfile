FROM node:16.15.0-slim

WORKDIR /usr/src/app

COPY dist ./dist
COPY server.js .
COPY node_modules ./node_modules
COPY package.json .
COPY src/build/scripts/decorator.js ./src/build/scripts/decorator.js
COPY envSettings.js ./envSettings.js

EXPOSE 8080
CMD ["npm", "run", "start-express"]
