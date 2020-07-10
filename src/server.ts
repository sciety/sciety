import { createServer, Server } from 'http';
import path from 'path';
import Router from '@koa/router';
import rTracer from 'cls-rtracer';
import Koa, { ExtendableContext, Next, ParameterizedContext } from 'koa';
import mount from 'koa-mount';
import send from 'koa-send';
import { Logger } from './infrastructure/logger';

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

      logger('info', 'HTTP response may not have been completely sent', {
        status: res.statusCode,
      });
    });

    await next();
  });

  app.use(mount('/static', async (context: ParameterizedContext): Promise<void> => {
    await send(context, context.path, { root: path.resolve(__dirname, '../static') });
  }));
  app.use(router.middleware());

  app.on('error', (error) => {
    const payload = { error };
    if (error instanceof Error) {
      payload.error = {
        message: error.message,
        stack: error.stack,
      };
    }
    logger('error', 'Unhandled Error', payload);
  });

  const server = createServer(app.callback());

  server.on('clientError', (error, socket) => {
    if (error.code === 'ECONNRESET' || !socket.writable) {
      return;
    }

    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');

    logger('info', 'Sent early HTTP response due to client error', {
      status: 400,
      error,
    });
  });

  return server;
};
