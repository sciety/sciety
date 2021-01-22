import { Middleware, RouterContext } from '@koa/router';
import { OK } from 'http-status-codes';
import { Next } from 'koa';

export const robots = (): Middleware => (
  async ({ response }: RouterContext, next: Next): Promise<void> => {
    response.status = OK;
    response.body = `
User-Agent: *
${process.env.ALLOW_SITE_CRAWLERS === 'true' ? 'Allow' : 'Disallow'}: /
`;

    await next();
  }
);
