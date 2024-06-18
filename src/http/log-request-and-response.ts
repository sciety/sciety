import { Middleware } from 'koa';
import { Logger } from '../logger';

export const logRequestAndResponse = (logger: Logger): Middleware => async ({ request, res }, next) => {
  const startTime = new Date();
  const logLevel = request.url.startsWith('/static') ? 'debug' : 'info';
  logger(logLevel, 'Received HTTP request', {
    method: request.method,
    url: request.url,
    referer: request.headers.referer,
  });

  res.once('finish', () => {
    const durationInMs = new Date().getTime() - startTime.getTime();
    logger(logLevel, 'Sent HTTP response', {
      url: request.url,
      status: res.statusCode,
      durationInMs,
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
};
