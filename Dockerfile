FROM node:18.18-alpine AS node
ENV NODE_OPTIONS --unhandled-rejections=strict --enable-source-maps
WORKDIR /app

COPY .npmrc \
  package.json \
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

COPY .eslintignore \
  .eslintrc.js \
  .stylelintignore \
  .stylelintrc \
  jest.config.js \
  tsconfig.json \
  ./
COPY --from=npm-dev /app/ .
COPY test/ test/
COPY src/ src/
COPY static/ static/
COPY data/ data/
COPY scripts/ scripts/

CMD ["sh", "./scripts/start-dev.sh"]



#
# Stage: Production build
#
FROM dev AS build-prod
ENV NODE_ENV=production

RUN npx esbuild /app/src/index.ts --bundle --platform=node --outfile=build/index.js --target=node18
RUN npm run build:css

#
# Stage: Fast build without type checking
#
FROM dev AS build-fast
ENV NODE_ENV=production

COPY .swcrc ./
RUN npx swc src --out-dir build
RUN npm run build:css

#
# Stage: Production environment
#
FROM node AS prod
ENV NODE_ENV=production

COPY --from=build-prod /app/build/ build/
COPY --from=build-prod /app/static /static
COPY data/ data/

HEALTHCHECK --interval=5s --timeout=1s \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ping || exit 1

CMD ["node", "./build/index.js"]

#
# Stage: Local environment with fast build
#
FROM node AS fast
ENV NODE_ENV=production

COPY --from=npm-prod /app/ .
COPY --from=build-fast /app/build/src/ build/
COPY --from=build-fast /app/static/ static/
COPY data/ data/

HEALTHCHECK --interval=5s --timeout=1s \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ping || exit 1

CMD ["node", "./build/index.js"]
