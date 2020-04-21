import templateDate from './date';
import { Review } from './types/review';

export default (review: Review, idNamespace: string): string => (
  `<article>
    <h3>
    Reviewed by <span id="${idNamespace}-author">${review.author}</span>
    on ${templateDate(review.publicationDate)}
  </h3>
  ${review.summary}
  <a href="${review.url}" id="${idNamespace}-read-more"
    aria-labelledby="${idNamespace}-read-more ${idNamespace}-author">
    Read the full review
  </a>
  </article>`
);
