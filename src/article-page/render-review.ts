import clip from 'text-clipper';
import { Maybe } from 'true-myth';
import templateDate from '../templates/date';
import { ReviewId } from '../types/review-id';

export interface ExternalReview {
  publicationDate: Maybe<Date>;
  summary: Maybe<string>;
  url: URL;
}

export type RenderReview = (reviewId: ReviewId, editorialCommunityId: string, idNamespace: string) => Promise<string>;

export type GetReview = (reviewId: ReviewId) => Promise<ExternalReview>;

export type GetEditorialCommunityName = (editorialCommunityId: string) => Promise<string>;

export default (
  getReview: GetReview,
  getEditorialCommunityName: GetEditorialCommunityName,
  maxChars: number,
): RenderReview => (
  async (reviewId, editorialCommunityId, idNamespace) => {
    const fetchedReview = await getReview(reviewId);

    const date = fetchedReview.publicationDate.mapOr('', (publicationDate) => (
      `<div class="meta" data-test-id="reviewPublicationDate">${templateDate(publicationDate)}</div>`
    ));

    const summary = fetchedReview.summary.mapOr('', (summaryText) => (
      `<div class="description" data-test-id="reviewSummary">${clip(summaryText, maxChars)}</div>`
    ));

    return `
      <article class="content">

        <h3 class="header">
          Reviewed by
          <a href="/editorial-communities/${editorialCommunityId}" id="${idNamespace}-editorial-community">
            ${await getEditorialCommunityName(editorialCommunityId)}
          </a>
        </h3>

        ${date}

        ${summary}

        <div class="extra">
          <a href="${fetchedReview.url.href}" class="ui basic secondary button" id="${idNamespace}-read-more"
            aria-labelledby="${idNamespace}-read-more ${idNamespace}-editorial-community">
            Read the full review
            <i class="right chevron icon"></i>
          </a>
        </div>

      </article>
    `;
  }
);
