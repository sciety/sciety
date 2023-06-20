import { Middleware } from 'koa';
import { Logger } from '../../shared-ports';

export const logRequestBody = (logger: Logger): Middleware => async (context, next) => {
  logger(
    'debug',
    'Received command',
    {
      body: context.request.body,
      url: context.request.url,
    },
  );

  await next();
};
