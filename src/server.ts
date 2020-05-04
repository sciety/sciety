import { createServer, Server } from 'http';
import path from 'path';
import Router from '@koa/router';
import Koa, { ExtendableContext, Next, ParameterizedContext } from 'koa';
import mount from 'koa-mount';
import send from 'koa-send';
import createLogger from './logger';

export default (router: Router): Server => {
  const log = createLogger('server');
  const requestLog = log.extend('request');
  const responseLog = log.extend('response');

  const app = new Koa();

  app.use(async ({ req, request, response }: ExtendableContext, next: Next): Promise<void> => {
    requestLog(`${request.method} ${request.url} HTTP/${req.httpVersion}`);
    try {
      await next();
    } finally {
      responseLog(`HTTP/${req.httpVersion} ${response.status} ${response.message}`);
    }
  });
  app.use(mount('/static', async (context: ParameterizedContext): Promise<void> => {
    await send(context, context.path, { root: path.resolve(__dirname, '../static') });
  }));
  app.use(router.middleware());

  const server = createServer(app.callback());

  server.on('listening', (): void => log('Server running'));
  server.on('close', (): void => log('Server stopping'));

  return server;
};
