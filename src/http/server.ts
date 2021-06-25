import { createServer, Server } from 'http';
import Router from '@koa/router';
import rTracer from 'cls-rtracer';
import * as E from 'fp-ts/Either';
import Koa from 'koa';
import koaPassport from 'koa-passport';
import koaSession from 'koa-session';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { routeNotFound } from './route-not-found';
import { Logger } from '../infrastructure/logger';
import { User } from '../types/user';
import { toUserId } from '../types/user-id';

export const createApplicationServer = (router: Router, logger: Logger): E.Either<string, Server> => {
  const app = new Koa();

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

      logger('info', 'HTTP response may not have been completely sent', {
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
    'TWITTER_API_KEY',
    'TWITTER_API_SECRET_KEY',
    'TWITTER_API_BEARER_TOKEN',
  ];

  const missingVariables = requiredEnvironmentVariables.filter((variableName) => !process.env[variableName]);
  if (missingVariables.length) {
    logger('error', 'Missing environment variables', { missingVariables });
    return E.left(`Missing ${missingVariables.join(', ')} from environment variables`);
  }

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

  if (process.env.AUTHENTICATION_STRATEGY === 'local') {
    koaPassport.use(new LocalStrategy(
      (username, password, cb) => {
        const user: User = {
          id: toUserId('47998559'),
        };
        return cb(null, user);
      },
    ));
  } else {
    koaPassport.use(
      new TwitterStrategy(
        {
          consumerKey: process.env.TWITTER_API_KEY ?? '',
          consumerSecret: process.env.TWITTER_API_SECRET_KEY ?? '',
          callbackURL: `${process.env.APP_ORIGIN ?? ''}/twitter/callback`,
        },
        (token, tokenSecret, profile, cb) => {
          const user: User = {
            id: toUserId(profile.id),
          };

          cb(undefined, user);
        },
      ),
    );
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
    if (error.code === 'ECONNRESET' || !socket.writable) {
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
