import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import templatePage from '../templates/page';

export default (): Middleware => (
  async ({ response }: RouterContext, next: Next): Promise<void> => {
    response.type = 'html';
    response.body = templatePage(`

  <header class="content-header">

    <h1>
      eLife
    </h1>

  </header>

`);

    await next();
  }
);
