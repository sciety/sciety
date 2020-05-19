import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';

export default (): Middleware => (
  async ({ response, state }: RouterContext, next: Next): Promise<void> => {
    response.body = `
<section class="about-page">
  ${state.html}
</section>`;

    await next();
  }
);
