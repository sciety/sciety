import { Context, Middleware, Next } from 'koa';

export default (): Middleware => (
  async ({ response, state }: Context, next: Next): Promise<void> => {
    response.body = `
<section class="about-page">
  ${state.html}
</section>`;

    await next();
  }
);
