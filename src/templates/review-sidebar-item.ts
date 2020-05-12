import templateDate from './date';
import Doi from '../data/doi';

export interface ReviewSidebarItem {
  publicationDate: Date;
  doi: Doi;
  editorialCommunityName: string;
}

export default (review: ReviewSidebarItem): string => (
  `<article>
    <h3>
      <a href="https://doi.org/${review.doi}" aria-label="Review by ${review.editorialCommunityName}">
        ${review.editorialCommunityName}
      </a>
    </h3>
    ${templateDate(review.publicationDate)}
  </article>`
);
