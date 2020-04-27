import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import fetchAllArticles from '../api/fetch-all-articles';
import templateArticleTeaser from '../templates/article-teaser';
import templateListItems from '../templates/list-items';
import templatePage from '../templates/page';

export default (): Middleware => {
  const teasers = fetchAllArticles().map((reviewedArticle) => templateArticleTeaser(reviewedArticle, `/articles/${encodeURIComponent(reviewedArticle.article.doi)}`));
  const page = templatePage(`<main>

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

  return async ({ response }: RouterContext, next: Next): Promise<void> => {
    response.body = page;

    await next();
  };
};
