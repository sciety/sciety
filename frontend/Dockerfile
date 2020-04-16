FROM node:12.16.2-alpine3.11 AS node
ENV NODE_OPTIONS --unhandled-rejections=strict
WORKDIR /app



#
# Stage: Production NPM install
#
FROM node AS npm-prod

COPY package.json \
  package-lock.json \
  ./

RUN npm install --production



#
# Stage: Development NPM install
#
FROM npm-prod AS npm-dev

RUN npm install



#
# Stage: Production build
#
FROM node AS build-prod
ENV NODE_ENV=production

COPY tsconfig.json .
COPY --from=npm-dev /app/ .
COPY src/ src/

RUN npm run build



#
# Stage: Production environment
#
FROM node AS prod

COPY --from=npm-prod /app/ .
COPY --from=build-prod /app/build/ build/
COPY static/ static/

CMD ["npm", "run", "start"]
