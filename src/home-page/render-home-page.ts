import { Middleware, RouterContext } from '@koa/router';
import { BadRequest } from 'http-errors';
import { Next } from 'koa';
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
      '<a href="/articles/10.1101/833392">Uncovering the hidden antibiotic potential of Cannabis</a> added by eLife just now',
      '<a href="/articles/10.1101/642017">Toxoplasma gondii Infection Drives Conversion of NK Cells into ILC1s</a> added by eLife minutes ago',
      '<a href="/articles/10.1101/615682">A genetic selection reveals functional metastable structures embedded in a toxin-encoding mRNA</a> added by eLife 2 hours ago',
      '<a href="/articles/10.1101/629618">Androgen-regulated transcription of ESRP2 drives alternative splicing patterns in prostate cancer</a> added by eLife 1 day ago',
      '<a href="/articles/10.1101/600445">Extensive Ribosome and RF2 Rearrangements during Translation Termination</a> added by eLife last week',
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
  
    <section>
      <h2>
        Most recent reviews
      </h2>
      <ol>
        ${templateListItems(mostRecentReviews)}
      </ol>
    </section>
  
  </div>
`;

    await next();
  }
);
