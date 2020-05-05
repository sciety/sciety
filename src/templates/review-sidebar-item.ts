import templateDate from './date';
import { Review } from '../types/review';

export default (review: Review): string => (
  `<article>
    <h3>
      <a href="https://doi.org/${review.doi}" aria-label="Review by eLife">eLife</a>
    </h3>
    ${templateDate(review.publicationDate)}
  </article>`
);
