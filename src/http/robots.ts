import { OK } from 'http-status-codes';
import { Middleware } from 'koa';

export const robots = (): Middleware => (
  async ({ response }, next) => {
    response.status = OK;
    response.body = `
User-Agent: *
${process.env.ALLOW_SITE_CRAWLERS === 'true' ? 'Allow' : 'Disallow'}: /
`;

    await next();
  }
);
