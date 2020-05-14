import { Context, Middleware, Next } from 'koa';
import Doi from '../data/doi';
import templateListItems from '../templates/list-items';

interface Teaser {
  doi: Doi;
  title: string;
}

interface ViewModel {
  name: string;
  description: string;
  teasers: Array<Teaser>;
}

export default (): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    const { viewModel } = ctx.state;
    const teasers = viewModel.teasers.map((teaser: Teaser) => (
      `<a href="/articles/${teaser.doi}">${teaser.title}</a>`
    ));
    ctx.response.type = 'html';
    ctx.response.body = `

  <header class="content-header">

    <h1>
      ${viewModel.name}
    </h1>

  </header>

  <section>

    <p>
      ${viewModel.description}
    </p>

  </section>

  <section>

    <h2>
      Recently reviewed articles
    </h2>

    <ol>
      ${templateListItems(teasers)}
    </ol>

  </section>

`;

    await next();
  }
);
