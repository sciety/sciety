import clip from 'text-clipper';
import { Maybe } from 'true-myth';
import templateDate from '../templates/date';
import { ReviewId } from '../types/review-id';

export interface Review {
  publicationDate: Maybe<Date>;
  summary: Maybe<string>;
  url: URL;
  editorialCommunityId: string;
  editorialCommunityName: string;
}

export type RenderReview = (review: Review, idNamespace: string) => Promise<string>;

export type GetReview = (reviewId: ReviewId, editorialCommunityId: string) => Promise<Review>;

export default (getReview: GetReview, maxChars: number): RenderReview => (
  async (review: Review, idNamespace) => {
    const date = review.publicationDate.mapOr('', (publicationDate) => (
      `<div class="meta" data-test-id="reviewPublicationDate">${templateDate(publicationDate)}</div>`
    ));

    const summary = review.summary.mapOr('', (summaryText) => (
      `<div class="description" data-test-id="reviewSummary">${clip(summaryText, maxChars)}</div>`
    ));

    return `
      <article class="content">

        <h3 class="header">
          Reviewed by
          <a href="/editorial-communities/${review.editorialCommunityId}" id="${idNamespace}-editorial-community">
            ${review.editorialCommunityName}
          </a>
        </h3>

        ${date}

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
  }
);
