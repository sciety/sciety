import { Middleware, RouterContext } from '@koa/router';
import { BadRequest } from 'http-errors';
import { Next } from 'koa';
import templateMostRecentReviews from './templates/most-recent-reviews';
import Doi from '../data/doi';
import templateListItems from '../templates/list-items';
import EditorialCommunityRepository from '../types/editorial-community-repository';

export default (editorialCommunities: EditorialCommunityRepository): Middleware => (
  async ({ request, response }: RouterContext, next: Next): Promise<void> => {
    const editorialCommunityLinks = editorialCommunities.all().map((ec) => `<a href="/editorial-communities/${ec.id}">${ec.name}</a>`);
    if (request.query.articledoi) {
      let doi: Doi;
      try {
        doi = new Doi(request.query.articledoi);
      } catch (error) {
        throw new BadRequest('Not a valid DOI.');
      }
      response.redirect(`/articles/${doi}`);
      await next();
      return;
    }

    const mostRecentReviews = [
      {
        articleDoi: new Doi('10.1101/833392'),
        articleTitle: 'Uncovering the hidden antibiotic potential of Cannabis',
        editorialCommunityName: 'eLife',
      },
      {
        articleDoi: new Doi('10.1101/642017'),
        articleTitle: 'Toxoplasma gondii Infection Drives Conversion of NK Cells into ILC1s',
        editorialCommunityName: 'eLife',
      },
      {
        articleDoi: new Doi('10.1101/615682'),
        articleTitle: 'A genetic selection reveals functional metastable structures embedded in a toxin-encoding mRNA',
        editorialCommunityName: 'eLife',
      },
      {
        articleDoi: new Doi('10.1101/629618'),
        articleTitle: 'Androgen-regulated transcription of ESRP2 drives alternative splicing patterns in prostate cancer',
        editorialCommunityName: 'eLife',
      },
      {
        articleDoi: new Doi('10.1101/600445'),
        articleTitle: 'Extensive Ribosome and RF2 Rearrangements during Translation Termination',
        editorialCommunityName: 'eLife',
      },
    ];

    response.body = `<header class="content-header">

    <h1>
      PRC
    </h1>

  </header>

  <form method="get" action="/" class="find-reviews compact-form">

    <fieldset>

      <legend class="compact-form__title">
        Find reviews for an article
      </legend>

      <div class="compact-form__row">

        <label>
          <span class="visually-hidden">Search for an article by bioRxiv DOI</span>
          <input
            type="text"
            name="articledoi"
            placeholder="Search for an article by bioRxiv DOI"
            class="compact-form__article-doi"
            required>
        </label>

        <button type="submit" class="compact-form__submit">
          <span class="visually-hidden">Find reviews</span>
        </button>

      </div>

    </fieldset>

  </form>

  <div class="content-lists">

    <section>
      <h2>
        Editorial communities
      </h2>
      <ol>
        ${templateListItems(editorialCommunityLinks)}
      </ol>
    </section>
  
    ${templateMostRecentReviews(mostRecentReviews)}
  
  </div>
`;

    await next();
  }
);
