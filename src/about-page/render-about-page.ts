import { Context, Middleware, Next } from 'koa';

export default (): Middleware => (
  async ({ response, state }: Context, next: Next): Promise<void> => {
    response.body = `
<header class="ui basic padded vertical segment">

<h1 class="ui header">
  About the Untitled Publish&ndash;Review&ndash;Curate Platform
</h1>
</header>
<div class="content">
  ${state.html}
</div>`;
    await next();
  }
);
