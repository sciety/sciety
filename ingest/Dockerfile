FROM node:18.18-alpine AS node
ENV NODE_OPTIONS --unhandled-rejections=strict --enable-source-maps
WORKDIR /app

COPY package.json \
  package-lock.json \
  ./



#
# Stage: Development NPM install
#
FROM node AS npm-dev
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV TAIKO_SKIP_CHROMIUM_DOWNLOAD=true
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=true

RUN npm ci



#
# Stage: Development environment
#
FROM node AS dev
ENV NODE_ENV=development
ENV PRETTY_LOG=true

COPY jest.config.js \
  tsconfig.json \
  ./
COPY --from=npm-dev /app/ .
COPY test/ test/
COPY src/ src/
CMD ["sh", "./scripts/start-dev.sh"]



#
# Stage: Production build
#
FROM dev AS build-prod
ENV NODE_ENV=production

RUN npm run build

#
# Stage: Production NPM install
#
FROM node AS npm-prod

RUN npm ci --production



#
# Stage: Production environment
#
FROM node AS prod
ENV NODE_ENV=production

COPY --from=npm-prod /app/ .
COPY --from=build-prod /app/build/src/ build/

CMD ["node", "./build/index.js"]
