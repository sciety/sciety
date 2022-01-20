import { Middleware } from 'koa';
import { Logger } from '../infrastructure';

export const logCommand = (logger: Logger): Middleware => async (context, next) => {
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
