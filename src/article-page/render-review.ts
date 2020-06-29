import clip from 'text-clipper';
import templateDate from '../templates/date';

export interface ReviewSummary {
  publicationDate: Date;
  summary?: string;
  url: URL;
  editorialCommunityId: string;
  editorialCommunityName: string;
}

export default (review: ReviewSummary, idNamespace: string, maxChars: number): string => {
  let summary = '';
  if (review.summary) {
    summary = `<div class="description" data-test-id="reviewSummary">${clip(review.summary, maxChars)}</div>`;
  }
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

      ${summary}

      <div class="extra">
        <a href="${review.url.href}" class="ui basic secondary button" id="${idNamespace}-read-more"
          aria-labelledby="${idNamespace}-read-more ${idNamespace}-editorial-community">
          Read the full review
          <i class="right chevron icon"></i>
        </a>
      </div>

    </article>
  `;
};
