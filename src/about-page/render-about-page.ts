import { Context, Middleware, Next } from 'koa';

export default (): Middleware => (
  async ({ response, state }: Context, next: Next): Promise<void> => {
    response.body = `
<header class="content-header">

<h1>
  About the Untitled Publish–Review–Curate Platform
</h1>
</header>
<div class="content">
  <section class="about-page">
    ${state.html}
  </section>
</div>`;
    await next();
  }
);
