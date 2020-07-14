import { RenderArticleAbstract } from './render-article-abstract';
import { RenderPageHeader } from './render-page-header';
import { RenderReviews } from './render-reviews';
import Doi from '../types/doi';

type RenderPage = (doi: Doi) => Promise<string>;

export default (
  renderPageHeader: RenderPageHeader,
  renderReviews: RenderReviews,
  renderAbstract: RenderArticleAbstract,
): RenderPage => (
  async (doi) => (
    `<article class="ui aligned stackable grid">
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
    </article>`
  )
);
