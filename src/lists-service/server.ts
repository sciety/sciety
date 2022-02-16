import { createServer, Server } from 'http';
import Router from '@koa/router';
import rTracer from 'cls-rtracer';
import * as E from 'fp-ts/Either';
import Koa from 'koa';
import koaSession from 'koa-session';
import { Adapters } from './adapters';
import { routeNotFound } from '../http/route-not-found';

export const createApplicationServer = (router: Router, adapters: Adapters): E.Either<string, Server> => {
  const app = new Koa();
  const { logger } = adapters;

  app.use(rTracer.koaMiddleware());

  app.use(async ({ request, res }, next) => {
    logger('info', 'Received HTTP request', {
      method: request.method,
      url: request.url,
      referer: request.headers.referer,
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

      logger('warn', 'HTTP response may not have been completely sent', {
        status: res.statusCode,
      });
    });

    await next();
  });

  const isSecure = process.env.APP_ORIGIN?.startsWith('https:');
  if (isSecure) {
    app.use(async (ctx, next) => {
      ctx.cookies.secure = true;
      await next();
    });
  }

  app.keys = [process.env.APP_SECRET ?? 'this-is-not-secret'];
  app.use(koaSession(
    {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      secure: isSecure,
    },
    app,
  ));

  app.use(router.middleware());
  app.use(routeNotFound);

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
    if (!socket.writable) {
      logger('info', 'Non writable socket, no response sent', {
        error,
      });
      return;
    }

    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');

    logger('info', 'Sent early HTTP response due to client error', {
      status: 400,
      error,
    });
  });

  return E.right(server);
};
