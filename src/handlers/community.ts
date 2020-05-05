import { Middleware, RouterContext } from '@koa/router';
import { NotFound } from 'http-errors';
import { Next } from 'koa';
import Doi from '../data/doi';
import templateListItems from '../templates/list-items';
import templatePage from '../templates/page';
import { Community } from '../types/community';
import { CommunityArticle } from '../types/community-article';

export default (community: Community): Middleware => (
  async ({ params, response }: RouterContext, next: Next): Promise<void> => {
    const communityId = params.id;
    if (communityId !== community.id) {
      throw new NotFound(`${communityId} not found`);
    }

    const communityArticles: Array<CommunityArticle> = [
      {
        doi: new Doi('10.1101/833392'),
        title: 'Uncovering the hidden antibiotic potential of Cannabis',
      },
      {
        doi: new Doi('10.1101/2020.03.22.002386'),
        title: 'A SARS-CoV-2-Human Protein-Protein Interaction Map Reveals Drug Targets and Potential Drug-Repurposing',
      },
    ];
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
