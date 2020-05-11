import { Middleware, RouterContext } from '@koa/router';
import { NotFound } from 'http-errors';
import { Next } from 'koa';
import { FetchEditorialCommunityArticles } from '../api/fetch-editorial-community-articles';
import templateListItems from '../templates/list-items';
import { EditorialCommunity } from '../types/editorial-community';

export default (
  communities: Array<EditorialCommunity>,
  fetchCommunityArticles: FetchEditorialCommunityArticles,
): Middleware => (
  async ({ params, response }: RouterContext, next: Next): Promise<void> => {
    const communityId = params.id;
    const community = communities.find((each) => each.id === communityId);

    if (!community) {
      throw new NotFound(`${communityId} not found`);
    }

    const communityArticles = await fetchCommunityArticles(community.id);
    const communityArticleTeasers = templateListItems(communityArticles.map((communityArticle) => (
      `<a href="/articles/${communityArticle.doi}">${communityArticle.title}</a>`
    )));
    response.type = 'html';
    response.body = `

  <header class="content-header">

    <h1>
      ${community.name}
    </h1>

  </header>

  <section>

    <p>
      ${community.description}
    </p>

  </section>

  <section>

    <h2>
      Recently reviewed articles
    </h2>

    <ol>
      ${communityArticleTeasers}
    </ol>

  </section>

`;

    await next();
  }
);
