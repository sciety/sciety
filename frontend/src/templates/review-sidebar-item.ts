import templateDate from './date';
import { Review } from '../types/review';

export default (review: Review): string => (
  `<article>
    <h3>
      <a href="${review.url}" aria-label="Review by ${review.author}">${review.author}</a>
    </h3>
    ${templateDate(review.publicationDate)}
  </article>`
);
