import templateDate from './date';
import communities from '../data/communities';
import { Review } from '../types/review';

export default (review: Review, idNamespace: string): string => (
  `<article class="review-summary">
    <h3 class="review-summary__title">
    Reviewed by <a href="/communities/${communities[0].id}" id="${idNamespace}-author">${communities[0].name}</a>
    on ${templateDate(review.publicationDate)}
  </h3>
  ${review.summary}
  <a href="https://doi.org/${review.doi}" class="review-summary__link" id="${idNamespace}-read-more"
    aria-labelledby="${idNamespace}-read-more ${idNamespace}-author">
    Read the full review
  </a>
  </article>`
);
