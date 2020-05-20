import { Middleware, RouterContext } from '@koa/router';
import { BadRequest } from 'http-errors';
import { Next } from 'koa';
import templateMostRecentReviews from './templates/most-recent-reviews';
import Doi from '../data/doi';
import templateListItems from '../templates/list-items';
import EditorialCommunityRepository from '../types/editorial-community-repository';

export default (editorialCommunities: EditorialCommunityRepository): Middleware => (
  async ({ request, response, state }: RouterContext, next: Next): Promise<void> => {
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

    response.body = `<header class="content-header">

    <h1>
      Untitled Publish Review Curate Platform
    </h1>

  </header>

  <form method="get" action="/" class="find-reviews compact-form">

    <fieldset>

      <legend class="compact-form__title">
        Find an article
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
          <span class="visually-hidden">Find an article</span>
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
  
    ${templateMostRecentReviews(state.viewModel.mostRecentReviews)}
  
  </div>
`;

    await next();
  }
);
