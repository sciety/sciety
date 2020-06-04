import Doi from '../../data/doi';
import templateDate from '../../templates/date';

export interface ReviewSummary {
  publicationDate: Date;
  summary: string;
  doi: Doi;
  editorialCommunityId: string;
  editorialCommunityName: string;
}

export default (review: ReviewSummary, idNamespace: string): string => (
  `<article class="review-summary">
    <h3 class="ui header review-summary__title">
      Reviewed by
      <a href="/editorial-communities/${review.editorialCommunityId}" id="${idNamespace}-editorial-community">
        ${review.editorialCommunityName}
      </a>
      on ${templateDate(review.publicationDate)}
    </h3>
    ${review.summary}
    <a href="https://doi.org/${review.doi}" class="review-summary__link" id="${idNamespace}-read-more"
      aria-labelledby="${idNamespace}-read-more ${idNamespace}-editorial-community">
      Read the full review
    </a>
  </article>`
);
