import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import applyStandardPageLayout from '../templates/apply-standard-page-layout';

export default (): Middleware => (
  async ({ response }: RouterContext, next: Next): Promise<void> => {
    response.type = 'html';
    await next();
    if (typeof response.body !== 'string') {
      throw new Error('Response body must be a string');
    }
    response.body = applyStandardPageLayout(response.body);
  }
);
