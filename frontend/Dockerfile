FROM node:12.16.2-alpine3.11 AS node
WORKDIR /app



FROM node as npm-prod

COPY package.json \
  package-lock.json \
  ./

RUN npm install --production



FROM npm-prod as npm-dev

RUN npm install



FROM node as build

COPY tsconfig.json .
COPY --from=npm-dev /app/ .
COPY src src

RUN npm run build



FROM node as app

COPY --from=npm-prod /app/ .
COPY --from=build /app/build build
COPY static static

CMD ["npm", "run", "start"]
