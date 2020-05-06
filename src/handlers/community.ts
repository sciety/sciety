import { Middleware, RouterContext } from '@koa/router';
import { NotFound } from 'http-errors';
import { Next } from 'koa';
import { FetchCommunityArticles } from '../api/fetch-community-articles';
import templateListItems from '../templates/list-items';
import { Community } from '../types/community';

export default (communities: Array<Community>, fetchCommunityArticles: FetchCommunityArticles): Middleware => (
  async ({ params, response }: RouterContext, next: Next): Promise<void> => {
    const communityId = params.id;
    const community = communities[0];

    if (communityId !== community.id) {
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
