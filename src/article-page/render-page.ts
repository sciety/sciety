import { RenderAddReviewForm } from './render-add-review-form';
import { RenderArticleAbstract } from './render-article-abstract';
import { RenderPageHeader } from './render-page-header';
import { RenderReviews } from './render-reviews';
import Doi from '../types/doi';

type RenderPage = (doi: Doi) => Promise<string>;

export default (
  renderPageHeader: RenderPageHeader,
  renderReviews: RenderReviews,
  renderAbstract: RenderArticleAbstract,
  renderAddReviewForm: RenderAddReviewForm,
): RenderPage => (
  async (doi) => (
    `<article class="ui aligned stackable grid">
      <div class="row">
        <div class="column">
          ${await renderPageHeader(doi)}
        </div>
      </div>

      <div class="row">
        <section class="twelve wide column">
          ${await renderAbstract(doi)}
          ${await renderReviews(doi)}
        </section>
        <aside class="four wide right floated column">
          ${await renderAddReviewForm(doi)}
        </aside>
      </div>
    </article>`
  )
);
