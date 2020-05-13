import { Middleware, RouterContext } from '@koa/router';
import { BadRequest } from 'http-errors';
import { Next } from 'koa';
import { article3 } from '../data/article-dois';
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
          <span class="visually-hidden">DOI of an article</span>
          <input type="text" name="articledoi" placeholder="${article3}" class="compact-form__article-doi" required>
        </label>

        <button type="submit" class="compact-form__submit">
          <span class="visually-hidden">Find reviews</span>
        </button>

      </div>

    </fieldset>

  </form>

  <section>
    <h2> Editorial communities </h2>
    <ol>
      ${templateListItems(editorialCommunityLinks)}
    </ol>
  </section>`;

    await next();
  }
);
