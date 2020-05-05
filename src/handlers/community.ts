import { Middleware, RouterContext } from '@koa/router';
import { NotFound } from 'http-errors';
import { Next } from 'koa';
import { FetchCommunityArticles } from '../api/fetch-community-articles';
import templateListItems from '../templates/list-items';
import templatePage from '../templates/page';
import { Community } from '../types/community';

export default (community: Community, fetchCommunityArticles: FetchCommunityArticles): Middleware => (
  async ({ params, response }: RouterContext, next: Next): Promise<void> => {
    const communityId = params.id;
    if (communityId !== community.id) {
      throw new NotFound(`${communityId} not found`);
    }

    const communityArticles = await fetchCommunityArticles();
    const communityArticleTeasers = templateListItems(communityArticles.map((communityArticle) => (
      `<a href="/articles/${communityArticle.doi}">${communityArticle.title}</a>`
    )));
    response.type = 'html';
    response.body = templatePage(`

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

`);

    await next();
  }
);
