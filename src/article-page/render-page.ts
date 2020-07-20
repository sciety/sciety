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
  async (doi) => (
    Result.ok(`<article class="ui aligned stackable grid">
      <div class="row">
        <div class="column">
          ${await renderPageHeader(doi)}
        </div>
      </div>

      <div class="row">
        <section class="column">
          ${await renderAbstract(doi)}
          ${await renderReviews(doi)}
        </section>
      </div>
    </article>`)
  )
);
