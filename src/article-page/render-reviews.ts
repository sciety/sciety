import { RenderReview, Review } from './render-review';
import templateListItems from '../templates/list-items';
import Doi from '../types/doi';

export type RenderReviews = (doi: Doi) => Promise<string>;

export type GetReviews = (doi: Doi) => Promise<Array<Review>>;

export default (
  renderReview: RenderReview,
  reviews: GetReviews,
  id: string,
): RenderReviews => async (doi) => {
  const renderedReviews = (await reviews(doi)).map((review, index) => (
    renderReview(review, `review-${index}`)
  ));
  if (renderedReviews.length === 0) {
    return '';
  }
  return `
      <section id="${id}">
        <h2 class="ui header">
          Reviews
        </h2>
        <ol class="ui very relaxed divided items ordered list">
          ${templateListItems(renderedReviews)}
        </ol>
      </section>
    `;
};
