import { createServer, Server } from 'http';
import Router from '@koa/router';
import rTracer from 'cls-rtracer';
import * as E from 'fp-ts/Either';
import Koa from 'koa';
import koaPassport from 'koa-passport';
import koaSession from 'koa-session';
import { auth0PassportStrategy } from './authentication/auth0-passport-strategy';
import { testingPassportStrategy } from './authentication/testing-passport-strategy';
import { routeNotFound } from './route-not-found';
import { CollectedPorts } from '../infrastructure';
import { EnvironmentVariables } from './environment-variables-codec';

export const createApplicationServer = (
  router: Router,
  ports: CollectedPorts,
  environmentVariables: EnvironmentVariables,
): E.Either<string, Server> => {
  const app = new Koa();
  const { logger } = ports;

  app.use(rTracer.koaMiddleware());

  app.use(async ({ request, res }, next) => {
    const startTime = new Date();
    const logLevel = request.url.startsWith('/static') ? 'debug' : 'info';
    logger(logLevel, 'Received HTTP request', {
      method: request.method,
      url: request.url,
      referer: request.headers.referer,
    });

    res.once('finish', () => {
      const durationInMs = new Date().getTime() - startTime.getTime();
      logger(logLevel, 'Sent HTTP response', { status: res.statusCode, durationInMs });
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

  const requiredEnvironmentVariables = [
    'APP_ORIGIN',
    'APP_SECRET',
    'PGUSER',
    'PGHOST',
    'PGPASSWORD',
    'PGDATABASE',
  ];

  const missingVariables = requiredEnvironmentVariables.filter((variableName) => !process.env[variableName]);
  if (missingVariables.length) {
    logger('error', 'Missing environment variables', { missingVariables });
    return E.left(`Missing ${missingVariables.join(', ')} from environment variables`);
  }

  const appOrigin = environmentVariables.APP_ORIGIN;
  const isSecure = appOrigin.startsWith('https:');
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

  const shouldUseStubAdapters = process.env.USE_STUB_ADAPTERS === 'true';

  koaPassport.use(auth0PassportStrategy());
  if (shouldUseStubAdapters) {
    koaPassport.use(testingPassportStrategy);
  }

  app.use(koaPassport.initialize());
  app.use(koaPassport.session());

  koaPassport.serializeUser((user, done) => {
    done(null, user);
  });

  koaPassport.deserializeUser((user, done) => {
    done(null, user);
  });

  app.use(router.middleware());
  app.use(routeNotFound(ports));

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
