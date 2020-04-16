FROM node:12.16.2-alpine3.11 AS node
WORKDIR /app



FROM node as npm

COPY package.json \
  package-lock.json \
  ./

RUN npm install --production



FROM node as app

COPY --from=npm /app/node_modules node_modules
COPY static static

CMD ["npx", "serve", "static", "--listen", "80"]
