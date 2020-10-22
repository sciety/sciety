import { createServer, Server } from 'http';
import Router from '@koa/router';
import rTracer from 'cls-rtracer';
import Koa, { ExtendableContext, Next } from 'koa';
import koaPassport from 'koa-passport';
import koaSession from 'koa-session';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Logger } from '../infrastructure/logger';
import { User } from '../types/user';
import userId from '../types/user-id';

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

  const isSecure = !!process.env.APP_ORIGIN;
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

  koaPassport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_API_KEY ?? 'my_key',
        consumerSecret: process.env.TWITTER_API_SECRET_KEY ?? 'my_secret',
        callbackURL: `${process.env.APP_ORIGIN ?? 'http://localhost:8080'}/twitter/callback`,
      },
      (token, tokenSecret, profile, cb) => {
        const user: User = {
          id: userId(profile.id),
        };

        cb(undefined, user);
      },
    ),
  );

  app.use(koaPassport.initialize());
  app.use(koaPassport.session());

  koaPassport.serializeUser((user, done) => {
    done(null, user);
  });

  koaPassport.deserializeUser((user, done) => {
    done(null, user);
  });

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
