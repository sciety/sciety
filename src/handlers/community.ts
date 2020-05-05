import { Middleware, RouterContext } from '@koa/router';
import { NotFound } from 'http-errors';
import { Next } from 'koa';
import templatePage from '../templates/page';
import { Community } from '../types/community';

export default (community: Community): Middleware => (
  async ({ params, response }: RouterContext, next: Next): Promise<void> => {
    const communityId = params.id;
    if (communityId !== community.id) {
      throw new NotFound(`${communityId} not found`);
    }
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
      <li>
        <a href="/articles/10.1101/833392">
          Uncovering the hidden antibiotic potential of Cannabis
        </a>
      </li>
      <li>
        <a href="/articles/10.1101/2020.03.22.002386">
          A SARS-CoV-2-Human Protein-Protein Interaction Map Reveals Drug Targets and Potential Drug-Repurposing
        </a>
      </li>
    </ol>

  </section>

`);

    await next();
  }
);
