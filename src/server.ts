import { createServer, Server } from 'http';
import path from 'path';
import Router from '@koa/router';
import rTracer from 'cls-rtracer';
import Koa, { ExtendableContext, Next, ParameterizedContext } from 'koa';
import mount from 'koa-mount';
import send from 'koa-send';
import { Logger } from './logger';

export default (router: Router, logger: Logger): Server => {
  const app = new Koa();

  app.use(rTracer.koaMiddleware());

  app.use(async ({ request, res }: ExtendableContext, next: Next): Promise<void> => {
    logger('info', 'Received HTTP request', {
      method: request.method,
      url: request.url,
    });

    res.once('finish', () => {
      logger('info', 'Sent HTTP response', {
        status: res.statusCode,
      });
    });

    res.once('close', () => {
      if (res.writableFinished) {
        return;
      }

      logger('info', 'HTTP response not completely sent', {
        status: res.statusCode,
      });
    });

    await next();
  });

  app.use(mount('/static', async (context: ParameterizedContext): Promise<void> => {
    await send(context, context.path, { root: path.resolve(__dirname, '../static') });
  }));
  app.use(router.middleware());

  app.on('error', (error) => logger('error', 'Unhandled Error', { error }));

  const server = createServer(app.callback());

  server.on('listening', (): void => logger('debug', 'Server running'));
  server.on('close', (): void => logger('debug', 'Server stopping'));

  return server;
};
