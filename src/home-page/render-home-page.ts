import { Context, Middleware, Next } from 'koa';
import templateMostRecentReviews from './templates/most-recent-reviews';
import templateListItems from '../templates/list-items';
import EditorialCommunityRepository from '../types/editorial-community-repository';

export default (editorialCommunities: EditorialCommunityRepository): Middleware => (
  async ({ response, state }: Context, next: Next): Promise<void> => {
    const editorialCommunityLinks = editorialCommunities.all().map((ec) => `<a href="/editorial-communities/${ec.id}">${ec.name}</a>`);

    response.body = `<div class="home-page">
    <header class="content-header">

    <h1>
      Untitled Publish Review Curate Platform
    </h1>

    <p>
      An experimental platform for multiple communities to provide post-publication peer review of scientific research.<br>
      <a href="/about">Learn more about the platform.</a>
    </p>

  </header>

  <form method="get" action="/articles" class="find-reviews compact-form">

    <fieldset>

      <legend class="compact-form__title">
        Find an article
      </legend>

      <div class="compact-form__row">

        <label>
          <span class="visually-hidden">Search for an article by bioRxiv DOI</span>
          <input
            type="text"
            name="doi"
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

    ${templateMostRecentReviews(state.viewModel.mostRecentReviews)}

    <section>
      <h2>
        Editorial communities
      </h2>
      <ol class="u-normalised-list">
        ${templateListItems(editorialCommunityLinks)}
      </ol>
    </section>
    
  </div>
  </div>
`;

    await next();
  }
);
