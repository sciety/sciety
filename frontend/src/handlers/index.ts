import { Middleware, RouterContext } from '@koa/router';
import { BadRequest } from 'http-errors';
import { Next } from 'koa';
import { FetchAllArticleTeasers } from '../api/fetch-all-article-teasers';
import { article3 } from '../data/article-dois';
import Doi from '../data/doi';
import templateArticleTeaser from '../templates/article-teaser';
import templateListItems from '../templates/list-items';
import templatePage from '../templates/page';

export default (fetchAllArticleTeasers: FetchAllArticleTeasers): Middleware => (
  async ({ request, response }: RouterContext, next: Next): Promise<void> => {
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

    const teasers = (await fetchAllArticleTeasers()).map(templateArticleTeaser);

    response.body = templatePage(`<main>

  <header class="content-header">

    <h1>
      PRC
    </h1>

  </header>

  <form method="get" action="/" class="find-reviews">

    <fieldset>

      <legend class="find-reviews__title">
        Find reviews for an article
      </legend>

      <div class="find-reviews__row">

        <label>
          <span class="visually-hidden">DOI of an article</span>
          <input type="text" name="articledoi" placeholder="${article3}" class="find-reviews__article-doi" required>
        </label>
    
        <button type="submit" class="find-reviews__submit">
          <span class="visually-hidden">Find reviews</span>
        </button>

      </div>

    </fieldset>

  </form>
  
  <section class="teaser-list">

    <h2 class="teaser-list__title">
      Recently reviewed articles
    </h2>

    <ol class="teaser-list__list">
      ${templateListItems(teasers)}
    </ol>

  </section>

</main>`);

    await next();
  }
);
