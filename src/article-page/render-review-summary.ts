import clip from 'text-clipper';
import Doi from '../data/doi';
import templateDate from '../templates/date';

export interface ReviewSummary {
  publicationDate: Date;
  summary: string;
  doi: Doi;
  editorialCommunityId: string;
  editorialCommunityName: string;
}

export default (review: ReviewSummary, idNamespace: string, maxChars: number): string => {
  const summary = clip(review.summary, maxChars);
  return `
    <article class="content">

      <h3 class="header">
        Reviewed by
        <a href="/editorial-communities/${review.editorialCommunityId}" id="${idNamespace}-editorial-community">
          ${review.editorialCommunityName}
        </a>
      </h3>

      <div class="meta">
        ${templateDate(review.publicationDate)}
      </div>

      <div class="description">
        ${summary}
      </div>

      <div class="extra">
        <a href="https://doi.org/${review.doi}" class="ui right floated basic secondary button" id="${idNamespace}-read-more"
          aria-labelledby="${idNamespace}-read-more ${idNamespace}-editorial-community">
          Read the full review
          <i class="right chevron icon"></i>
        </a>
      </div>

    </article>
  `;
};
