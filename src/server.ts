import { createServer, Server } from 'http';
import path from 'path';
import Router from '@koa/router';
import Koa, { ExtendableContext, Next, ParameterizedContext } from 'koa';
import mount from 'koa-mount';
import send from 'koa-send';
import { v4 as uuidv4 } from 'uuid';
import { BindableLogger } from './logger';

type SetRequestId = (requestId: string) => void;

export default (router: Router, logger: BindableLogger, setRequestId: SetRequestId): Server => {
  const app = new Koa();

  app.use(async (_, next) => {
    setRequestId(uuidv4());
    await next();
  });

  app.use(async ({ request, res }: ExtendableContext, next: Next): Promise<void> => {
    logger('info', 'Received HTTP request', {
      method: request.method,
      url: request.url,
    });

    const requestLogger = logger.bindToRequestId();

    res.once('finish', () => {
      requestLogger('info', 'Sent HTTP response', {
        status: res.statusCode,
      });
    });

    res.once('close', () => {
      if (res.writableFinished) {
        return;
      }

      requestLogger('info', 'HTTP response not completely sent', {
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

  // eslint-disable-next-line @typescript-eslint/no-misused-promises -- https://github.com/DefinitelyTyped/DefinitelyTyped/issues/40070
  const server = createServer(app.callback());

  server.on('listening', (): void => logger('debug', 'Server running'));
  server.on('close', (): void => logger('debug', 'Server stopping'));

  return server;
};
