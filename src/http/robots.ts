import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';

export const robots = (allowSiteCrawler: boolean): Middleware => (
  async ({ response }, next) => {
    response.status = StatusCodes.OK;
    response.body = `
User-Agent: *
${allowSiteCrawler ? 'Allow' : 'Disallow'}: /
`;

    await next();
  }
);
