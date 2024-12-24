import { Middleware } from 'koa';
import metricsClient from 'prom-client';
import { Logger } from '../logger';

const requestDurationHistogram = new metricsClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'time it took to before we sent the HTTP response (in seconds)',
  labelNames: ['status', 'route', 'method'] as const,
});

export const logRequestAndResponse = (logger: Logger): Middleware => async (ctx, next) => {
  const startTime = new Date();
  const logLevel = ctx.request.url.startsWith('/static') ? 'debug' : 'info';
  logger(logLevel, 'Received HTTP request', {
    method: ctx.request.method,
    url: ctx.request.url,
    referer: ctx.request.headers.referer,
  });

  ctx.res.once('finish', () => {
    const durationInMs = new Date().getTime() - startTime.getTime();
    requestDurationHistogram.observe(
      { route: ctx._matchedRoute, method: ctx.req.method, status: ctx.res.statusCode },
      durationInMs / 1000,
    );
    logger(logLevel, 'Sent HTTP response', {
      url: ctx.request.url,
      status: ctx.res.statusCode,
      durationInMs,
      route: ctx._matchedRoute,
    });
  });

  ctx.res.once('close', () => {
    if (ctx.res.writableFinished) {
      return;
    }

    logger('warn', 'HTTP response may not have been completely sent', {
      status: ctx.res.statusCode,
    });
  });

  await next();
};
