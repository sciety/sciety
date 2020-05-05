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

  <section>

  <p>
    eLife is a non-profit organisation created by funders and led by researchers. Our mission is to accelerate discovery
    by operating a platform for research communication that encourages and recognises the most responsible behaviours in
    science.
  </p>

  </section>

`);

    await next();
  }
);
