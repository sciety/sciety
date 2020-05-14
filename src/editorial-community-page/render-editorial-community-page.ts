import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import { FetchEditorialCommunityReviewedArticles } from '../api/fetch-editorial-community-reviewed-articles';
import templateListItems from '../templates/list-items';

export default (
  fetchEditorialCommunityReviewedArticles: FetchEditorialCommunityReviewedArticles,
): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    const { editorialCommunity } = ctx.state;

    const editorialCommunityReviewedArticles = await fetchEditorialCommunityReviewedArticles(editorialCommunity.id);
    const teasers = templateListItems(editorialCommunityReviewedArticles.map((editorialCommunityReviewedArticle) => (
      `<a href="/articles/${editorialCommunityReviewedArticle.doi}">${editorialCommunityReviewedArticle.title}</a>`
    )));
    ctx.response.type = 'html';
    ctx.response.body = `

  <header class="content-header">

    <h1>
      ${editorialCommunity.name}
    </h1>

  </header>

  <section>

    <p>
      ${editorialCommunity.description}
    </p>

  </section>

  <section>

    <h2>
      Recently reviewed articles
    </h2>

    <ol>
      ${teasers}
    </ol>

  </section>

`;

    await next();
  }
);
