import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import { FetchAllArticleTeasers } from '../api/fetch-all-article-teasers';
import templateArticleTeaser from '../templates/article-teaser';
import templateListItems from '../templates/list-items';
import templatePage from '../templates/page';

export default (fetchAllArticleTeasers: FetchAllArticleTeasers): Middleware => (
  async ({ response }: RouterContext, next: Next): Promise<void> => {
    const teasers = (await fetchAllArticleTeasers()).map(templateArticleTeaser);

    response.body = templatePage(`<main>

  <header class="content-header">

    <h1>
      PRC
    </h1>

  </header>

  <section class="teaser-list">

    <h2 class="teaser-list__title">
      Recently reviewed articles
    </h2>

    <ol class="teaser-list__list">
      ${templateListItems(teasers)}
    </ol>

  </section>

</main>`);

    await next();
  }
);
