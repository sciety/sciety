import { Middleware, RouterContext } from '@koa/router';
import { NotFound } from 'http-errors';
import { Next } from 'koa';
import { FetchEditorialCommunityReviewedArticles } from '../api/fetch-editorial-community-reviewed-articles';
import templateListItems from '../templates/list-items';
import { EditorialCommunity } from '../types/editorial-community';

export default (
  editorialCommunities: Array<EditorialCommunity>,
  fetchEditorialCommunityReviewedArticles: FetchEditorialCommunityReviewedArticles,
): Middleware => (
  async ({ params, response }: RouterContext, next: Next): Promise<void> => {
    const editorialCommunityId = params.id;
    const editorialCommunity = editorialCommunities.find((each) => each.id === editorialCommunityId);

    if (!editorialCommunity) {
      throw new NotFound(`${editorialCommunityId} not found`);
    }

    const editorialCommunityReviewedArticles = await fetchEditorialCommunityReviewedArticles(editorialCommunity.id);
    const teasers = templateListItems(editorialCommunityReviewedArticles.map((editorialCommunityReviewedArticle) => (
      `<a href="/articles/${editorialCommunityReviewedArticle.doi}">${editorialCommunityReviewedArticle.title}</a>`
    )));
    response.type = 'html';
    response.body = `

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
