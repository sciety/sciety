import { NotFound } from 'http-errors';
import { Result } from 'true-myth';
import { RenderArticleAbstract } from './render-article-abstract';
import { RenderPageHeader } from './render-page-header';
import { RenderReviews } from './render-reviews';
import Doi from '../types/doi';

export type RenderPageError = {
  type: 'not-found',
  content: string,
};

type RenderPage = (doi: Doi) => Promise<Result<string, RenderPageError>>;

export default (
  renderPageHeader: RenderPageHeader,
  renderReviews: RenderReviews,
  renderAbstract: RenderArticleAbstract,
): RenderPage => (
  async (doi) => {
    const abstract = (await renderAbstract(doi)).unwrapOrElse(() => {
      throw new NotFound(`${doi.value} not found`);
    });
    const pageHeader = (await renderPageHeader(doi)).unwrapOrElse(() => {
      throw new NotFound(`${doi.value} not found`);
    });
    return Result.ok(`<article class="ui aligned stackable grid">
      <div class="row">
        <div class="column">
          ${pageHeader}
        </div>
      </div>

      <div class="row">
        <section class="column">
          ${abstract}
          ${await renderReviews(doi)}
        </section>
      </div>
    </article>`);
  }
);
