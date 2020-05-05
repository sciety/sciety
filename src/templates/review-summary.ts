import templateDate from './date';
import { Review } from '../types/review';

export default (review: Review, idNamespace: string): string => (
  `<article class="review-summary">
    <h3 class="review-summary__title">
    Reviewed by <a href="/communities/b560187e-f2fb-4ff9-a861-a204f3fc0fb0" id="${idNamespace}-author">eLife</a>
    on ${templateDate(review.publicationDate)}
  </h3>
  ${review.summary}
  <a href="https://doi.org/${review.doi}" class="review-summary__link" id="${idNamespace}-read-more"
    aria-labelledby="${idNamespace}-read-more ${idNamespace}-author">
    Read the full review
  </a>
  </article>`
);
